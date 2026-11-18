// Client IMAP minimal (TLS, LOGIN, UID SEARCH/FETCH/STORE) : imapflow se bloque au téléchargement sous Deno.
const enc = new TextEncoder(), dec = new TextDecoder();

export class Imap {
  #conn: Deno.TlsConn | null = null;
  #tampon = new Uint8Array(0);
  #n = 0;

  async connecter(hote: string, port = 993) {
    this.#conn = await Deno.connectTls({ hostname: hote, port });
    await this.#ligne(); // salutation du serveur
  }

  async #lire() {
    const morceau = new Uint8Array(64 * 1024);
    const n = await this.#conn!.read(morceau);
    if (n === null) throw new Error("IMAP : connexion fermée");
    const t = new Uint8Array(this.#tampon.length + n);
    t.set(this.#tampon); t.set(morceau.subarray(0, n), this.#tampon.length);
    this.#tampon = t;
  }

  async #ligne(): Promise<string> {
    for (;;) {
      const i = this.#tampon.indexOf(10);
      if (i >= 0) {
        const l = dec.decode(this.#tampon.subarray(0, i)).replace(/\r$/, "");
        this.#tampon = this.#tampon.slice(i + 1);
        return l;
      }
      await this.#lire();
    }
  }

  async #octets(n: number): Promise<Uint8Array> {
    while (this.#tampon.length < n) await this.#lire();
    const o = this.#tampon.slice(0, n);
    this.#tampon = this.#tampon.slice(n);
    return o;
  }

  // envoie une commande ; renvoie les lignes non étiquetées et les littéraux {n} reçus
  async commande(cmd: string): Promise<{ lignes: string[]; litteraux: Uint8Array[] }> {
    const tag = `A${++this.#n}`;
    await this.#conn!.write(enc.encode(`${tag} ${cmd}\r\n`));
    const lignes: string[] = [], litteraux: Uint8Array[] = [];
    for (;;) {
      const l = await this.#ligne();
      if (l.startsWith(tag + " ")) {
        if (!/^\S+ OK/i.test(l)) throw new Error(`IMAP ${cmd.split(" ")[0]} : ${l.slice(tag.length + 1, tag.length + 120)}`);
        return { lignes, litteraux };
      }
      lignes.push(l);
      const m = l.match(/\{(\d+)\}$/);
      if (m) litteraux.push(await this.#octets(Number(m[1])));
    }
  }

  static guillemets = (s: string) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

  async connexion(user: string, pass: string) {
    await this.commande(`LOGIN ${Imap.guillemets(user)} ${Imap.guillemets(pass)}`);
    await this.commande("SELECT INBOX");
  }

  async nonLus(): Promise<number[]> {
    const { lignes } = await this.commande("UID SEARCH UNSEEN");
    const l = lignes.find((x) => /^\* SEARCH/i.test(x)) ?? "";
    return l.replace(/^\* SEARCH/i, "").trim().split(/\s+/).filter(Boolean).map(Number).filter(Number.isFinite);
  }

  // source complète sans marquer le message lu
  async source(uid: number): Promise<Uint8Array | null> {
    const { litteraux } = await this.commande(`UID FETCH ${uid} BODY.PEEK[]`);
    return litteraux[0] ?? null;
  }

  async marquerLus(uids: number[]) {
    if (uids.length) await this.commande(`UID STORE ${uids.join(",")} +FLAGS.SILENT (\\Seen)`);
  }

  async fermer() {
    try { await this.commande("LOGOUT"); } catch { /* sans effet */ }
    try { this.#conn?.close(); } catch { /* déjà fermée */ }
  }
}
