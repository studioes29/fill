# Carte de signature des mails (Studio ES et Fill) découpée en images, pour qu'elle reste identique en mode sombre :
# les messageries assombrissent les fonds HTML mais jamais les images. Cinq morceaux (taille double, affichés à
# 500 x 122) : « haut » (nom, métier, filigrane), puis la bande du bas en « tel », « site », « rdv » (chacun cliquable)
# et « coin » (fin du filigrane).
#   python3 outils/signature-mail.py <nom.png> <filigrane.png> <couleur> <site> <dossier de sortie> <police Inter Tight .ttf>
import sys
from PIL import Image, ImageDraw, ImageFont

nom_png, fil_png, couleur, site, sortie, police = sys.argv[1:7]
fond = tuple(int(couleur.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4)) + (255,)
nom, fil = Image.open(nom_png).convert("RGBA"), Image.open(fil_png).convert("RGBA")
W, H, HN = 1000, 244, 168                        # carte entière, hauteur de la bande du nom
haut = Image.new("RGBA", (W, HN), (0, 0, 0, 0))
haut.alpha_composite(nom, (0, 0)); haut.alpha_composite(fil.crop((0, 0, 260, HN)), (740, 0))
haut.save(f"{sortie}/signature-haut.png", optimize=True)
fil.crop((0, HN, 260, H)).save(f"{sortie}/signature-coin.png", optimize=True)

f = ImageFont.truetype(police, 26)
try: f.set_variation_by_axes([400])
except Exception: pass
encre = (20, 20, 20, 255)
parts = [("06 51 22 21 07", False), (site, True), ("Prendre rendez-vous", True)]
sep = "  ·  "
x, y = 44, HN + 12
bornes, pos = [0], []
for i, (t, sous) in enumerate(parts):
    w = f.getlength(t); pos.append((x, t, sous)); x += w
    if i < len(parts) - 1:
        ws = f.getlength(sep); # bornes paires : largeurs entières une fois réduites de moitié
        bornes.append(2 * round((x + ws / 2) / 2)); x += ws
bornes.append(740)
bande = Image.new("RGBA", (740, H - HN), (0, 0, 0, 0))
d = ImageDraw.Draw(bande)
d.rounded_rectangle((0, -40, 740 + 40, H - HN - 1), radius=36, fill=fond)   # coin arrondi en bas à gauche seulement
for (px, t, sous) in pos:
    d.text((px, y - HN), t, font=f, fill=encre)
    if px > 44: d.text((px - f.getlength(sep) + f.getlength("  "), y - HN), "·", font=f, fill=encre)
    if sous:
        asc = f.getbbox("Ag")[3]
        d.line((px, y - HN + asc + 3, px + f.getlength(t), y - HN + asc + 3), fill=encre, width=2)
for k, nomf in enumerate(["tel", "site", "rdv"]):
    a, b = bornes[k], bornes[k + 1]
    bande.crop((a, 0, b, H - HN)).save(f"{sortie}/signature-{nomf}.png", optimize=True)
print(",".join(str((b - a) // 2) for a, b in zip(bornes[:-1], bornes[1:])))
