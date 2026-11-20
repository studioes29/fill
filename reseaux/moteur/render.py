import asyncio,sys,os
from playwright.async_api import async_playwright
names=sys.argv[1:]
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--allow-file-access-from-files"])
        pg=await b.new_page(viewport={"width":1080,"height":1920})
        os.makedirs('/home/claude/launch/png',exist_ok=True)
        for n in names:
            await pg.goto(f'file:///home/claude/launch/html/{n}.html'); await pg.wait_for_timeout(900)
            await pg.evaluate('seek(END+1)')
            await (await pg.query_selector('#pg')).screenshot(path=f'/home/claude/launch/png/{n}.png')
        await b.close()
asyncio.run(m())
