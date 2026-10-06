// Run: node check.cjs [http://127.0.0.1:8765]
// Uses an existing Playwright install; no application dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawnSync} = require('node:child_process');
const root=__dirname;
const home=os.homedir();
let library=process.env.PLAYWRIGHT_MODULE;
if(!library){
  try{library=require.resolve('playwright');}catch(_){
    const cache=path.join(home,'.npm/_npx');
    if(fs.existsSync(cache))library=fs.readdirSync(cache).map(d=>path.join(cache,d,'node_modules/playwright')).find(p=>fs.existsSync(path.join(p,'package.json')));
  }
}
assert(library,'Set PLAYWRIGHT_MODULE to an installed Playwright module path.');
const {chromium}=require(library);
const cache=path.join(home,'.cache/ms-playwright');
const executable=process.env.CHROMIUM_PATH || (fs.existsSync(cache) ? fs.readdirSync(cache).filter(d=>d.startsWith('chromium-')).map(d=>path.join(cache,d,'chrome-linux64/chrome')).find(fs.existsSync):undefined);
async function main(){
  // These commands print help only; never inspect or control a running session.
  const evidence=[];
  const run=(...args)=>{const r=spawnSync('herdr',args,{encoding:'utf8'});assert(!r.error);const text=r.stdout+r.stderr;assert(text.length>0);evidence.push('$ herdr '+args.join(' ')+'\n'+text);return text;};
  assert.match(run('--version'),/0\.9\.0/);
  assert.match(run('--help'),/--session <name>/);
  const defaults=run('--default-config');
  const bindings={prefix:'ctrl+b',help:'prefix+?',detach:'prefix+q',new_tab:'prefix+c',previous_tab:'prefix+p',next_tab:'prefix+n',split_vertical:'prefix+v',split_horizontal:'prefix+minus',zoom:'prefix+z',focus_pane_left:'prefix+h',focus_pane_down:'prefix+j',focus_pane_up:'prefix+k',focus_pane_right:'prefix+l',toggle_sidebar:'prefix+b'};
  for(const [key,value] of Object.entries(bindings))assert(defaults.includes(`${key} = "${value}"`),`binding: ${key}`);
  const pane=run('pane');for(const command of ['herdr pane current','herdr pane split','--no-focus','--cwd PATH'])assert(pane.includes(command));
  assert(run('workspace').includes('herdr workspace rename'));
  assert(run('tab').includes('herdr tab create'));
  const agent=run('agent');assert(agent.includes('herdr agent list'));assert(agent.includes('herdr agent explain'));
  fs.writeFileSync(path.join(root,'verified-herdr-help.txt'),evidence.join('\n\n'));
  const browser=await chromium.launch({executablePath:executable,headless:true});
  try{
    const context=await browser.newContext({viewport:{width:1440,height:1050},permissions:['clipboard-read','clipboard-write']});
    const page=await context.newPage();const errors=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    const url=process.argv[2]||'http://127.0.0.1:8765';
    assert.equal((await page.goto(url)).status(),200);
    assert.equal(await page.locator('#missions button').count(),9);
    const total=await page.evaluate(()=>lessons.length);
    assert.equal(total,9);
    const complete=page.locator('#complete');
    assert(await complete.isDisabled());
    await page.locator('#instructions .command button').first().click();
    assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'printenv HERDR_ENV');
    await page.locator('#recall').click();assert(await page.locator('#instructions').isHidden());
    await page.locator('#reveal').click();assert(await page.locator('#instructions').isVisible());
    await page.locator('#guided').click();
    const shots=process.env.TMPDIR||path.join(home,'.hermes/cache/scratch');
    await page.screenshot({path:path.join(shots,'herdr-field-guide-desktop.png'),fullPage:true});
    for(let i=0;i<total;i++){
      assert.equal(await page.evaluate(()=>state.index),i);
      const answer=await page.evaluate(()=>lessons[state.index].answer);
      const buttons=page.locator('#answers button');
      await buttons.nth((answer+1)%3).click();assert(await complete.isDisabled());
      assert.match(await page.locator('#feedback').innerText(),/Not quite/);
      await page.locator('#didIt').check();assert(await complete.isDisabled());
      await buttons.nth(answer).click();assert(await complete.isEnabled());
      await page.locator('#didIt').uncheck();assert(await complete.isDisabled());
      await page.locator('#didIt').check();
      if(i===total-1)assert(await page.locator('#instructions').isHidden());
      await complete.click();
      assert.equal(await page.evaluate(()=>state.done.length),i+1);
    }
    assert(await page.locator('#completion').isVisible());
    await page.reload();assert(await page.locator('#completion').isVisible());
    assert.equal(await page.locator('#progress').getAttribute('value'),'9');
    await page.locator('#review').click();assert(await page.locator('#instructions').isHidden());
    await page.locator('#didIt').check();await page.locator('#answers button').first().click();await complete.click();
    assert.equal(await page.evaluate(()=>state.done.length),9,'repetition must not duplicate completions');
    // Cancel reset, then confirm it.
    page.once('dialog',d=>d.dismiss());await page.locator('#reset').click();assert.equal(await page.evaluate(()=>state.done.length),9);
    page.once('dialog',d=>d.accept());await page.locator('#reset').click();assert.equal(await page.evaluate(()=>state.done.length),0);
    assert(await page.locator('#completion').isHidden());assert(await complete.isDisabled());
    await page.setViewportSize({width:390,height:844});
    assert(await page.locator('#progressText').isVisible(),'mobile progress must remain visible');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile horizontal overflow');
    await page.screenshot({path:path.join(shots,'herdr-field-guide-mobile.png'),fullPage:true});
    // Invalid persisted data must not inject content or break navigation.
    await page.evaluate(()=>localStorage.setItem(storageKey,'{"index":999,"done":[-1,999]}'));
    await page.reload();assert.equal(await page.evaluate(()=>state.index),0);
    // No storage must degrade to an in-memory course rather than a dead page.
    const offline=await browser.newContext();
    await offline.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('disabled');}}));
    const q=await offline.newPage();await q.goto(url);
    assert(await q.locator('#storageWarning').isVisible());
    assert.equal(await q.locator('#missions button').count(),9);
    await offline.close();assert.deepEqual(errors,[]);
    console.log('PASS: Herdr 0.9.0 source checks; all 9 missions; wrong/retry/gates; clipboard; recall/reveal; completion; reload; repeat; reset/cancel; invalid/disabled storage; mobile overflow; zero browser errors.');
    console.log('Screenshots: '+shots+'/herdr-field-guide-{desktop,mobile}.png');
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
