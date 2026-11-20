import asyncio,sys,os,subprocess,shutil
from playwright.async_api import async_playwright
FPS=30
async def m(names,W,H,suffix,outdir):
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--allow-file-access-from-files"])
        pg=await b.new_page(viewport={"width":W,"height":H})
        for n in names:
            await pg.goto(f'file:///home/claude/launch/html/{n}.html'); await pg.wait_for_timeout(900)
            end=await pg.evaluate('END'); total=end+3.5
            d=f'/tmp/fr_{n}'; shutil.rmtree(d,ignore_errors=True); os.makedirs(d)
            el=await pg.query_selector('#pg')
            for i in range(int(total*FPS)):
                await pg.evaluate(f'seek({i/FPS})')
                await el.screenshot(path=f'{d}/f{i:04d}.png',type='png')
            os.makedirs(outdir,exist_ok=True)
            subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate',str(FPS),'-i',f'{d}/f%04d.png','-c:v','libx264','-preset','veryfast','-crf','14','-pix_fmt','yuv420p','-movflags','+faststart',f'{outdir}/{n}{suffix}.mp4'],check=True)
            print(n,total)
        await b.close()
names=sys.argv[1].split(','); W=int(sys.argv[2]); H=int(sys.argv[3]); outdir=sys.argv[4]
asyncio.run(m(names,W,H,'',outdir))
