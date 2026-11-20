import json,re
B={'ig1':'1c9d1e5f9e41f541ee15031f538dfdd4','ig2':'4faa8aec166b10199b432dbd4dd72fc1','ig3':'5a31d71d724ce53da2881e817d7371a5','ig4':'0d37c15572a7a3f2f19ad275e7b2d811','ig5':'aec5c0d30bbceab75c0dc30d86fdde9e','ig6':'7598fb61e0e4417246da72b6e68223ec','ig7':'df3f6f2bd8216683588672a8763c4beb','ig8':'c847824e4da2e3d9b07ceb7c742cbeee','st1':'2a3f0e67c3f991c147f71fb38da7472b','st2':'cd86948fda6edee5b5480a287f8cb9af','st3':'1d0099c7ada8554281ef723a2e4812a7','st4':'a7d05059a08277263a4600237fcbde1a','st5':'6cdfcec988f40142e8503293e5078ac2','st6':'fa76d9204ead7771cf82d5d62d78ad01','st7':'faaa9a92f8ab33fbbcd1c855bab20cc7','st8':'bb16a65b400ceac903d71e28a11d6221','li01':'556f37367bea48cf9614fd9a095fe2a3','li02':'3a537b95debf692435e27e438952393f','li03':'4521acb35eb93c5bedeb760e953c2361','li04':'2ea87d8cf640e7d86f8ab1012e1c97e7','li05':'7761e76e4b4ba9c4fe64cb0ef9dca8fa','li06':'0e7113911894d74536cf39f100c76712','li07':'daca32821e1ee54272fdb06fd83ab0c0','li08':'f3d6839cf7df55c02d9e9f5550b9fae0','li09':'0d2cda81c4372a51c3f9e978e93c3480','li10':'4a65bb2ab4b5fb41f7fcb7605d432ad9','li11':'e144f67d461dc80385029a28d2e25147','li12':'e56546cb5ffc76f7e0700beeeb8ba6c7'}
B.update({'ig1': 'f877bdfbf242c89bc9e63fa4273751e2', 'ig2': '3b7407af49731a9658c4d6df54042aa9', 'ig3': '98b8d0c1865b9221f4bbbada12fd87b2', 'ig4': '8a1c09d7082a6d5f65da2f0911b1b479', 'ig5': 'ef1c5c304de90fbf53a0b6ba7da758f6', 'ig6': '22d9b1282ea763400b0318aa68655c50', 'ig7': '694301e044a68ee6b9532a66b830d74f', 'ig8': '62219093603a16cd99150e533a560097', 'ig9': '8fbef83ccf8479c1bf6380ca6b232b15', 'li01': 'c780240cbec45ee8cfb70dbed953151d', 'li02': '034ce56a9a75c493a27b5625fe0721ec', 'li03': 'e4dff9cf67f3c29e0799269c1255e403', 'li04': '920a95041f9bddfdb2de186f99911239', 'li05': '315bfaa412684d4cdefad28dafbb22ba', 'li06': 'b06516c8faa1a7681fdf1a999859128f', 'li07': 'dbb990e86eabdd7a8c4f17f2465813de', 'li08': '92f71e04c63552ed58db00748435c5c0', 'li09': '6b0c2a1f8903fea17b74c7ca373c0138', 'li10': '0a06bf925aa804d39d743c7542322c07', 'li11': '66dfbfede4f7131ff65e3256dfd95824', 'li12': 'd71ad1bba8db3915a64bfaa12481f677', 'li13': '29c59e8ee59de915414aca8445380d55', 'st01': 'dce20b60142ccf166a5c79737177144e', 'st02': 'ba86770b9376cae28a9e883eb179963a', 'st03': '55bdfabeecb2371eb8e044badf195967', 'st04': '8b011b6b7ed7089dbd65d6de5652621a', 'st05': 'c3c55bcc0306d10aa3f9500cda2c3603', 'st06': '577c904a09f2dbcedd43645144c54234', 'st07': '9f52eba3d6aaa768d43face2fac26aec', 'st08': 'ec334e3f1837c0ee6ad3cd3a42a378b8', 'st09': '73d770f96f2ad6ee714ad0c9f1ee9678', 'st10': '8b1de4924e4dee736868366f43306768', 'cA': '574dac918600518acceebaecb41af87b'})
B.update({'ig2': '5c43bd545e0dc085f1e1af39b1064f20', 'ig3': '0be483d7fcc96d6029033facc3281ec7', 'ig4': '54150bac75b4f049e34b183b24607651', 'ig5': 'abef38b9c38e83b453bc861624e63760', 'ig7': '4329b4390ed89278e21a34f6ea11f560', 'ig8': '1693780aaafa1b631c7cfcae0bca04c1', 'li09': 'd2bc20c61b6317e0141e03f27ea16e7e', 'li11': '08d2c8bcbba20e77a56901b7da98e9ad', 'li12': '0f2dccb0269b1369d8b4656679e713d1', 'st02': '58b3a49796e4aae139ed58a347e9fc3a', 'st03': 'a3f61fd1b06b8710924adbcfca5015c5', 'st04': '94a1352768532387c7ebca8043858c4f', 'st05': '025b6f956581fdceb8f8010f39b4771b', 'st07': '6d683dfccef36666d0faa90d9f7b9372', 'st08': 'ea57a7fed140509f99214b113c79625e', 'st09': '73ba978958747c72fb25501e31210a88'})
B.update({'ig1': 'a8b2be5cb122aa0d54be461fc498d78a', 'ig2': 'fde31aec59bb964d97aca7a91c15ccec', 'ig3': '4b982e485ab43ed4156f3b275b508d30', 'ig4': '541d52ce3b1db4755d42e35a25cad962', 'ig5': 'c7b564696649011d6dec6e0e1f2f8261', 'ig6': '05c9518d59614042923282b1557b1ce7', 'ig7': 'ef94fd9df09a4a0acc4e24b933f60186', 'ig8': '7f2d32a59a9c8ff2cf9c1bebd939fa5f', 'ig9': '40ee88ee15b88979125ea9d72a57a4b6', 'li01': 'd0dcc6afe0bd34cef47aac65a9ad26de', 'li02': 'afe5d5c0663a26cf59146ff0078cfdc5', 'li03': '126f85df990f6d4b75c6d85aabed7bea', 'li04': 'a06bf2d6dc4441721e72f8808caa51cb', 'li05': '5012ebb349c6a7fc40ca918be57ef9d4', 'li06': '20862440e0869411d77a4cad2acd4d3d', 'li07': 'b3fa7d780588dfd165ee37182696b9d5', 'li08': '33e0697da3076dec6b62c62a07bb1e71', 'li09': '6dd6c3ee27224cfdd4f3a75663fbb4a0', 'li10': '6ed0063d872aade5674060ccdf8206c0', 'li11': 'e03d32977d8b415d0bd3f6f592c415ec', 'li12': '795b6e9db90e9a897a5433a4df8ee900', 'li13': 'c3e756f01d51c5d46d0e7570af9496ee', 'st01': '8032d69a05598158ad678e1402c320d5', 'st02': '084a469e34e13685aa836085d8491c04', 'st03': '85ff678d3b4f0d16f63262f2d264353b', 'st04': 'a75ddb969fe466f94d19d7397ed78139', 'st05': 'f87baca77a7500b5f07fe81f4bcddd73', 'st06': '2be575aa8e9045415617d7da846efe04', 'st07': '999f82be601f1176f457090fab9633dd', 'st08': 'bb0b86521240682de57011d17846ee17', 'st09': '23f16650c867b23c829c0ab7dda6f4bc', 'st10': '311c976ccb3514e61cfaa6afbf0ede24'})
B.update({'ig1': 'adb2aea0860091594e3472ac7ec468c3', 'ig2': '7b4fb4d49dd332c1beb70c5602b51ff5', 'ig3': '1cd23922a51b1044984bab95b0c0d663', 'ig4': 'b3b46b37277b10bd05da892c863b149b', 'ig5': 'b0e75e7f2ca655112928e2d1a32193c2', 'ig6': 'f3969edc5dad0be0af1abb0ae299eba4', 'ig7': '844a9fbb54aa93861d2b2e6154da224e', 'ig8': 'd35a47156c5746b129707df6fa473c53', 'ig9': 'f0eb80ea8ed2489df9b8783162c090a8', 'li01': '2531a8dc89940fa1808869683dca3ca2', 'li02': 'e66a60547d41eb8a5b8323c844324d2a', 'li03': '8558e177c190f605e5e87cf3f7d54775', 'li04': 'd4418af09bd44cec7bb319c9014c2425', 'li05': '842817c0b7e47ffadd9ce029c17b5eac', 'li06': 'afe0546ae509c869f9636e2e650680ca', 'li07': 'db68a542512851e837509871ea3bb561', 'li08': '43b46dd7a7f95708fc20ac2f2ecc37d6', 'li09': '64e93789afa36d8d0829dc9849ad9513', 'li10': '23ee696f1520e712e33997484de059bc', 'li11': '73f7820e43c62c6206846c8e34a72fed', 'li12': '40c67329384b8ee4c633e1cb6373ab39', 'li13': '3b98d54f46cc3ea55e99b8f7a00397f0', 'st01': '43557a1c194f16c9407da71ba4613630', 'st02': '5508fe322eb6baf60500fba93cab5f31', 'st03': 'bb131c6349ce40f5622c48737bec41f2', 'st04': '287125248eba21005798fc7b1f6863b0', 'st05': '79a156c9a17ff9a320c6e19c0e5f3212', 'st06': '3cd4d2ba401732c7174dbe7c399c1bb7', 'st07': '69f3e8c00d95e3c19d3850ddc35cb3bd', 'st08': '5f0cefffeb3ea907d7e1b6f3314c44c2', 'st10': '4ac3f79dca9567d85f556fe7f81a1fcc'})
B.update({'ig1': '78d62538f73c57a07978dddb89d58e9a', 'ig2': '62efe179ba8f0a0bdb4958c6ac0025eb', 'ig3': 'ef76b1aa52cc67e8b0efa9a4f65a7c54', 'ig4': '7e2e55fca50d882a5d2cb0968ed90232', 'ig5': '723f7c3fc654f0d1d7546805c61b376a', 'ig6': '6201b56fb0880132e6222fc131982218', 'ig7': '89311f3b1fe2a23b87b6eb0a3be60c8a', 'ig8': 'f9828c3f0c1f136c0d8c24ef1113ecd1', 'ig9': 'd41456d68772c55916715552c8b4231c', 'li01': 'a23911839e3c8e14cf1d3d4ae52ecdba', 'li02': 'eaba4b4ff412237088f252943f1f99a1', 'li03': '9a2603dd008c0b6f88a1b42c7f08d812', 'li04': 'b70a5b3b0bbb0ed76d4d3bb9a91f8391', 'li05': 'bc3f435e744ecac00c495e6ef3ffe743', 'li06': 'cd061696e08c07593fc4ae714ede3d8c', 'li07': '9e272e77ab115a78f501400fbf447088', 'li08': '4026063aa285a4ca635d088cb26f4b21', 'li09': '0d4a342be203c360fea382a268785835', 'li10': '221d1aace80592c6a74cca69b2bd2594', 'li11': 'd50bc40c49f016f937a67171f2d19c65', 'li12': 'd90ee5203e65b7bdce7727798f6c6e2c', 'li13': 'fff4c447c3583d4a6529583fbcf5d0f8', 'st01': '41a833e0bdc904bc90c2610d892ca7ac', 'st02': 'e5bef1da13f7f522b6176ce2f587fa95', 'st03': 'a65de77f43982a351613d7185ec6c756', 'st04': '32d9afc177fc0bef913d17559fa9d26b', 'st05': '62804e3636d4d253fbdcc30088ac8a81', 'st06': 'f583790215e3a3dcc5eb970f2843f01b', 'st07': '14d4a1a709670ebf4f3ec3fea289c215', 'st08': '699f7cb98a2401554cda535990499606', 'st10': '65ee0df9c6bfb152eff1a836aa2c1fee'})
B.update({'ig2': 'ef0676c0412d89d2e4b7cf32c6c05d75', 'ig3': '56af363eff45e2f670250e196d636a0f', 'ig4': 'a998a6f22a54dead11d9609a886c90a4', 'ig8': '16d85dcec14059d2aca7389fe406cbd8', 'st02': 'be59f79fafcc3546f95cc4cee2518236', 'st03': 'a257c01076bb4469d8b32d1a3d205f12', 'st04': '97acd88fc325fa37aae8377ae666b963', 'st08': 'ab61771159bf2b76c019486dfda82462'})
HEAD='''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>%s</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<style>
body{margin:0}
</style>
</helmet>
%s
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview": {"width": %d, "height": %d}}'>
class Component extends DCLogic {
renderVals() {
return {};
}
}
</script>
</body>
</html>
'''
def board(fn,key,title,h):
    body=f'<div style="width: 1080px; height: {h}px"><img src="/_blob/{B[key]}" alt="{title}" style="display: block; width: 1080px; height: {h}px"></div>'
    open(f'out2/{fn}','w').write(HEAD%(title,body,1080,h))

B.update({'st09':'084cc870588d504a7e0a2632baf9fe24','ig1':'f7013c378142f10e0a014892f993f0b5','li01':'93654c60d2a20e4a2f27629d86b4151d','bw1':'cfbf12bbc0e3815df438aafa6a126aa5','series':'cfbb339c7b6fa9fc44d5ab2cd098768d'})
def board2(fn,key,title,w,h):
    body=f'<div style="width: {w}px; height: {h}px"><img src="/_blob/{B[key]}" alt="{title}" style="display: block; width: {w}px; height: {h}px"></div>'
    open(f'out2/{fn}','w').write(HEAD%(title,body,w,h))
IG=[('ig1','Couverture'),('ig2','Le constat (animée)'),('ig3','Fill prend le relais (animée)'),('ig4','Le parcours en 4 étapes (animée)'),('ig5','Le catalogue'),('ig6','Pour qui'),('ig7','Les formules'),('ig8','Un mois en Régulier (animée)'),('ig9','Fin')]
LI=['Couverture','Les demandes s’empilent','La page dort','Fill prend le relais','Trois lignes suffisent','Fill décline','Sans votre accord','Publié','Le catalogue','Pour qui','Les formules','Un mois en Régulier','Fin']
ST=[('st01','Couverture'),('st02','Le constat (animée)'),('st03','Fill prend le relais (animée)'),('st04','Le parcours (animée)'),('st05','Le catalogue'),('st06','Pour qui'),('st07','Les formules'),('st08','Un mois en Régulier (animée)'),('st09','Offre de lancement'),('st10','Fin')]
c=json.load(open('canvas.json'))
for k in list(c['boards']):
    if re.match(r'(L\d|J\d|LG-|ST-)',k): del c['boards'][k]
for k in ['tL','tJ1','tJ2','tJ3','tLG','tST']: c['notes'].pop(k,None)
c['boards']['Grille.dc.html']['h']=1830
# shift templates G/P up
dy=7400-9150
for k in list(c['boards']):
    if re.match(r'[GP]\d',k): c['boards'][k]['y']+=dy
c['notes']['tG']['y']+=dy; c['notes']['tP']['y']+=dy
Y=11200+dy+1350+300
c['notes']['tIG']={'x':0,'y':Y,'text':'24 novembre · Post de lancement · Instagram (9 pages, 4 animées)','kind':'title1','maxW':11500}
new=[]
for i,(k,t) in enumerate(IG):
    fn=f'IG-{i+1}.dc.html'; board(fn,k,f'{i+1} · {t}',1350); c['boards'][fn]={'x':i*1160,'y':Y+300,'w':1080,'h':1350,'title':f'Instagram {i+1} · {t}'}; new.append(fn)
fn='COV-A.dc.html'; board(fn,'cA','Couverture alternative · Organigramme',1350); c['boards'][fn]={'x':5800,'y':11200-1750,'w':1080,'h':1350,'title':'Couverture alternative · Organigramme (pour un autre post)'}; new.append(fn)
Y2=Y+300+1350+300
c['notes']['tLI']={'x':0,'y':Y2,'text':'24 novembre · Post de lancement · LinkedIn (13 pages fixes, PDF)','kind':'title1','maxW':15000}
for i,t in enumerate(LI):
    k=f'li{i+1:02d}'; fn=f'LI-{i+1:02d}.dc.html'; board(fn,k,f'{i+1} · {t}',1350); c['boards'][fn]={'x':i*1160,'y':Y2+300,'w':1080,'h':1350,'title':f'LinkedIn {i+1} · {t}'}; new.append(fn)
Y3=Y2+300+1350+300
c['notes']['tSTO']={'x':0,'y':Y3,'text':'24 novembre · Stories de lancement (10, 4 animées)','kind':'title1','maxW':11500}
for i,(k,t) in enumerate(ST):
    fn=f'STO-{i+1}.dc.html'; board(fn,k,f'{i+1} · {t}',1920); c['boards'][fn]={'x':i*1160,'y':Y3+300,'w':1080,'h':1920,'title':f'Story {i+1} · {t}'}; new.append(fn)

B.update({'bw1':'d196857adc561c48db6cc606db8b9c57','bw2':'5c9688751f61181ba9969dbbc4c1ef8d','bw3':'2055905c17c1437021f527a5d7622465','une_fill':'f2c217c0c178a6071ec8e394d320fbcd','une_etapes':'a00f90c145e33c8b278dd9580d9837b2','une_formules':'aa15d231a2121c8ad060949444e40584','une_offre':'78a166e8e1d38494b31eadd59b5ef227'})
Y4=Y3+300+1920+300
c['notes']['tBW']={'x':0,'y':Y4,'text':'25 novembre · Offre de lancement (Instagram et LinkedIn, 3 pages)','kind':'title1','maxW':5720}
for j,(k,t) in enumerate([('bw1','Couverture'),('bw2','Ce qui est offert'),('bw3','Pour en profiter')]):
    fn=f'BW-{j+1}.dc.html'; board(fn,k,t,1350); c['boards'][fn]={'x':j*1160,'y':Y4+300,'w':1080,'h':1350,'title':f'Offre {j+1} · {t}'}; new.append(fn)
Y5=Y4+300+1350+300
c['notes']['tUNE']={'x':0,'y':Y5,'text':'Instagram Fill · couvertures des stories à la une','kind':'title1','maxW':5720}
for j,(k,t) in enumerate([('une_fill','Fill'),('une_etapes','Étapes'),('une_formules','Formules'),('une_offre','Offre')]):
    fn=f'UNE-{j+1}.dc.html'; board(fn,k,t,1920); c['boards'][fn]={'x':j*1160,'y':Y5+300,'w':1080,'h':1920,'title':f'À la une · {t}'}; new.append(fn)

B.update({'gd01': 'd9e135e2c498d2cad2ea22d55c5cafc4', 'gd02': '84905dc087f81aada5459e2358fa2d0f', 'gd03': '2b9fb4b819dce724a39f26e51b73c1ac', 'gd04': '4e14c7f1579f49921abc6f4f5cb52663', 'gd05': 'ee06c42672fc441883ee9ba6e42a15b6', 'gd06': '11f1c965a5a2a06bcb27afd908745617', 'gd07': '6b224056951c83e75fd2be9b8236707f', 'gd08': '3f822ef201fa533bcc84fa893ae956e3', 'gd09': '0bc76fdb3941a34f7ceb65489297d5eb', 'gd10': 'fbb322a6f810742df40ac46150f88a55'})
Y6=Y5+300+1920+300
c['notes']['tGD']={'x':0,'y':Y6,'text':'1er décembre · Guide n°1 · La com de décembre (10 pages)','kind':'title1','maxW':11500}
for j,t in enumerate(['Couverture', 'Décembre en 8 rendez-vous', 'Le programme des fêtes', 'Les dates limites', 'L’événement du mois', 'Les horaires des fêtes', 'Les vœux', 'L’année en images', 'Ce qu’on programme d’avance', 'Fin']):
    fn=f'GD-{j+1:02d}.dc.html'; k=f'gd{j+1:02d}'; board(fn,k,f'{j+1} · {t}',1350); c['boards'][fn]={'x':j*1160,'y':Y6+300,'w':1080,'h':1350,'title':f'Guide 1 · {j+1} · {t}'}; new.append(fn)
board2('Series.dc.html','series','Séries et formats',2400,1450); c['boards']['Series.dc.html']={'x':3480,'y':0,'w':2400,'h':1450,'title':'Séries et formats'}; new.append('Series.dc.html')
c['order']=[o for o in c['order'] if o in c['boards']]+new
json.dump(c,open('out2/canvas.json','w'),ensure_ascii=False)
# Grille
LOGO=open('logo_svg.txt').read()
def imp(n): return '<div style="position: relative; width: 338px; height: 450px; overflow: hidden; background: #E2DBD3"><div style="position: absolute; left: -11px; top: 0; width: 1080px; height: 1350px; transform: scale(0.33334); transform-origin: 0 0"><dc-import name="%s" hint-size="1080px,1350px"></dc-import></div></div>'%n
pin='<div style="position: relative; width: 338px; height: 450px; overflow: hidden; background: #E2DBD3"><img src="/_blob/%s" alt="Lancement" style="position: absolute; left: -11px; top: 0; width: 360px; height: 450px; display: block"><svg viewBox="0 0 24 24" width="34" height="34" style="position: absolute; right: 14px; top: 14px"><path fill="#fff" d="M16 3l5 5-3 1-4 4 1 5-2 2-4-4-5 5-1-1 5-5-4-4 2-2 5 1 4-4z"/></svg></div>'%B['ig1']
tiles=''.join([pin,imp('P4'),imp('P3'),imp('G1'),imp('P2'),imp('P5'),imp('G2'),imp('P1'),imp('G3')])
F="font-family: 'Inter Tight','Helvetica Neue',Arial,sans-serif"
body=('<div style="width: 1160px; box-sizing: border-box; padding: 80px; background: #FFFFFF; '+F+'; color: #1A1A1A"><div style="display: flex; align-items: center; gap: 28px; padding-bottom: 50px"><span style="display: flex; align-items: center; justify-content: center; width: 150px; height: 150px; border-radius: 50%; background: #F8F5F2; box-shadow: inset 0 0 0 2px rgba(26,26,26,.08)">'+LOGO+'</span><span style="display: flex; flex-direction: column; gap: 6px"><span style="'+F+'; font-weight: 700; font-size: 32px">fill.communication</span><span style="'+F+'; font-weight: 500; font-size: 24px; color: rgba(26,26,26,.65)">Fill · Service communication externalisé</span><span style="'+F+'; font-weight: 600; font-size: 24px; color: #5B3F9C">fill.studioes.fr</span></span></div><div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px">'+tiles+'</div><p style="margin: 40px 0 0; '+F+'; font-weight: 500; font-size: 22px; line-height: 1.45; color: rgba(26,26,26,.6)">Aperçu de la grille du profil, recadrée en 3:4 comme sur Instagram. Le post de lancement reste épinglé en tête de grille. On alterne les fonds d’un post à l’autre : jamais deux encre côte à côte.</p></div>')
g2=HEAD%('Aperçu de la grille Instagram',body,1160,1830)
open('out2/Grille.dc.html','w').write(g2)
print(len(new),Y,Y2,Y3)
