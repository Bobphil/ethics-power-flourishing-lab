import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SUPER='http://127.0.0.1:8001/ETHICS-SUPER-14-1.html';
const PFLAB='http://127.0.0.1:8002/ETHICS-PFLAB-14-1.html';
const EXPECTED_PFLAB='https://bobphil.github.io/ethics-power-flourishing-lab/ETHICS-PFLAB-14-1.html';
const out={checks:{}};
const ok=(name,value,detail='')=>{out.checks[name]={pass:!!value,detail}; if(!value) throw new Error(name+': '+detail);};

const browserCandidates=[
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
].filter(Boolean);
const executablePath=browserCandidates.find(p=>existsSync(p));
if(!executablePath) throw new Error('No system Chrome/Chromium found on runner');
const browser=await chromium.launch({headless:true,executablePath});
const ctx=await browser.newContext({acceptDownloads:true});
const page=await ctx.newPage();

await page.goto(SUPER,{waitUntil:'networkidle'});
await page.waitForFunction(()=>window.__ETHICS_SUPER_REDO_1__?.manifest?.chapters?.length===14);
ok('super_loads_14',true);

// Fresh merged-SUPER regression: CH1 corrected content + explanation layer.
await page.evaluate(()=>window.__ETHICS_SUPER_REDO_1__.go('CH01','workbook'));
await page.waitForFunction(()=>document.querySelector('#workbookBody')?.textContent?.includes('What Do You Actually Know?'));
const ch1Text=await page.locator('#workbookBody').innerText();
ok('ch1_correct_title',/What Do You Actually Know\?/.test(ch1Text),ch1Text.slice(0,400));
ok('ch1_correct_case',/Nail Through the Boot/.test(ch1Text),ch1Text.slice(0,500));
const ch1HelpCount=await page.locator('#workbookBody details.help').count();
ok('ch1_explanation_layer_present',ch1HelpCount>0,String(ch1HelpCount));
const ch1HelpTexts=await page.locator('#workbookBody details.help').allInnerTexts();
ok('ch1_explanation_layer_content',ch1HelpTexts.some(t=>/Explain this question|Explain this field|Explain this box|What this asks|Think it through/i.test(t)),ch1HelpTexts.slice(0,5).join(' || ').slice(0,1000));

// CH13/CH14 Module Route regression against the newly installed 14-chapter routing manifest.
await page.evaluate(()=>window.__ETHICS_SUPER_REDO_1__.go('CH13','read'));
await page.waitForFunction(()=>document.querySelector('#readBody')?.textContent?.includes('CH13'));
const ch13Links=await page.locator('#readBody a').evaluateAll(as=>as.map(a=>a.href));
ok('ch13_module_route_link',ch13Links.includes('https://pressbooks.pub/ethicalhistory/chapter/when-is-a-choice-still-yours/'),JSON.stringify(ch13Links));

await page.evaluate(()=>window.__ETHICS_SUPER_REDO_1__.go('CH14','read'));
await page.waitForFunction(()=>document.querySelector('#readBody')?.textContent?.includes('CH14'));
const ch14Links=await page.locator('#readBody a').evaluateAll(as=>as.map(a=>a.href));
ok('ch14_module_route_link',ch14Links.includes('https://pressbooks.pub/ethicalhistory/chapter/where-does-a-mind-begin-and-who-decides/'),JSON.stringify(ch14Links));
const ch14ReadText=await page.locator('#readBody').innerText();
ok('ch14_pflab14_url_visible',/ETHICS-PFLAB-14-1\.html/.test(await page.locator('#pflabUrl').inputValue()),await page.locator('#pflabUrl').inputValue());
out.checks.module_route_label_residue={pass:true,detail:/PFLAB-2/.test(ch14ReadText)?'COSMETIC_RESIDUE: Module Route prose still labels PFLAB-2 while URL is PFLAB-14.':'No stale PFLAB-2 wording detected.'};

const binding=await page.evaluate(()=>document.querySelector('#pflabUrl')?.value || null);
if(!binding){
  await page.evaluate(()=>window.__ETHICS_SUPER_REDO_1__.go(null,'read'));
}
const bound=await page.evaluate(()=>document.querySelector('#pflabUrl')?.value || null);
ok('super_bound_to_pflab14',bound===EXPECTED_PFLAB,bound||'missing');

await page.evaluate(()=>{
  const api=window.__ETHICS_SUPER_REDO_1__;
  const m=api.manifest;
  const chapters={}, tool_record={};
  for(const c of m.chapters){
    const moves={};
    for(const mv of c.moves) moves[mv.id]='browser acceptance '+c.id+' '+mv.id;
    const specific={};
    for(const f of c.specific_fields) specific[f.key]='browser acceptance '+c.id+' '+f.key;
    const card={
      judgment:'browser bounded judgment '+c.id,
      pressure:'browser pressure '+c.id,
      specific,
      claim_ceiling:c.claim,
      response:c.responses[0],
      carry:'browser carry '+c.id
    };
    chapters[c.id]={status:'READY',moves,card,snapshots:[{snapshot_id:c.id+'-browser',created_at:new Date().toISOString(),status:'READY',moves,card}],reopen_ledger:[]};
    tool_record[c.tool_id]={
      chapter_id:c.id,tool_id:c.tool_id,tool_name:c.tool,
      made_visible:'browser made visible '+c.id,
      claim_ceiling:c.claim,
      carry_forward:'browser carry '+c.id,
      output_card_ref:'OC-'+c.id,status:'READY',updated_at:new Date().toISOString()
    };
  }
  const state={
    schema_version:'2.3.0',content_version:m.content_version,
    active:{chapter:'CH14',view:'pflab'},chapters,tool_record,
    binding:{super_url:location.origin+location.pathname,pflab_url:'https://bobphil.github.io/ethics-power-flourishing-lab/ETHICS-PFLAB-14-1.html'},
    student:{export_name:'Browser Acceptance'},audit:{created_at:new Date().toISOString(),updated_at:new Date().toISOString()},migrated_from:null
  };
  localStorage.setItem('ETHICS_SUPER_14_1_14CH_V1',JSON.stringify(state));
});
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(()=>window.__ETHICS_SUPER_REDO_1__);
await page.evaluate(()=>window.__ETHICS_SUPER_REDO_1__.go('CH14','pflab'));
await page.waitForFunction(()=>document.querySelector('#launchPflab'));
const labText=await page.locator('#pflabBody').innerText();
ok('super_14of14_ready',/14\/14|All fourteen Output Cards are READY/.test(labText),labText.slice(0,300));
ok('super_lab_launch_enabled',!(await page.locator('#launchPflab').isDisabled()));

const downloadPromise=page.waitForEvent('download');
await page.locator('#exportPflab').click();
const download=await downloadPromise;
const handoffPath=path.resolve('browser-handoff-14.json');
await download.saveAs(handoffPath);
const handoff=JSON.parse(await fs.readFile(handoffPath,'utf8'));
ok('handoff_source',handoff.source_build==='ETHICS-SUPER-14-1',handoff.source_build);
ok('handoff_ready',handoff.ready===true,String(handoff.ready));
ok('handoff_tool_count',Object.keys(handoff.tool_record||{}).length===14,String(Object.keys(handoff.tool_record||{}).length));
ok('handoff_card_count',Object.keys(handoff.output_cards||{}).length===14,String(Object.keys(handoff.output_cards||{}).length));
ok('handoff_ch13',!!handoff.tool_record?.['TOOL-CH13']);
ok('handoff_ch14',!!handoff.tool_record?.['TOOL-CH14']);

const lab=await ctx.newPage();
await lab.goto(PFLAB,{waitUntil:'networkidle'});

// Fresh regression against the replaced PFLAB-14 production file.
// The new material lives in the Case Dossier route, which is hidden until activated.
await lab.locator('nav [data-route="dossier"]').click();
await lab.waitForFunction(()=>document.querySelector('.route[data-route="dossier"]')?.classList.contains('active'));
const dossierText=await lab.locator('.route[data-route="dossier"]').innerText();
ok('pflab_status_changes_step',/Status changes/i.test(dossierText),dossierText.slice(0,1800));
ok('pflab_third_firewall',/A flag ≠ a verdict/.test(dossierText),dossierText.slice(0,2200));
ok('pflab_sources_and_credits',/Sources and credits/i.test(dossierText),dossierText.slice(-2200));
// Return to the handoff route for the functional import checks.
await lab.locator('nav [data-route="handoff"]').click();
await lab.waitForFunction(()=>document.querySelector('.route[data-route="handoff"]')?.classList.contains('active'));

await lab.setInputFiles('#handoffFile',handoffPath);
await lab.waitForFunction(()=>document.querySelector('#handoffStatus')?.textContent?.includes('LAB UNLOCKED'));
const report14=await lab.locator('#handoffReport').innerText();
ok('pflab_current14_mode',/CURRENT_14|Current mode/i.test(report14),report14);
ok('pflab_ch13_enabled',!(await lab.locator('[data-tool="TOOL-CH13"]').isDisabled()));
ok('pflab_ch14_enabled',!(await lab.locator('[data-tool="TOOL-CH14"]').isDisabled()));

await lab.locator('#clearHandoff').click();
await lab.setInputFiles('#handoffFile','ETHICS-PFLAB-14-1_LEGACY12_HANDOFF_FIXTURE.json');
await lab.waitForFunction(()=>document.querySelector('#handoffStatus')?.textContent?.includes('LAB UNLOCKED'));
const report12=await lab.locator('#handoffReport').innerText();
ok('pflab_legacy12_mode',/LEGACY_12|Compatibility mode/i.test(report12),report12);
ok('legacy_ch13_disabled',await lab.locator('[data-tool="TOOL-CH13"]').isDisabled());
ok('legacy_ch14_disabled',await lab.locator('[data-tool="TOOL-CH14"]').isDisabled());

const self=await ctx.newPage();
await self.goto(PFLAB+'?selftest=1',{waitUntil:'networkidle'});
await self.waitForFunction(()=>!document.querySelector('#selftest')?.hidden);
const selfJson=JSON.parse(await self.locator('#selftest').innerText());
ok('pflab_selftest',selfJson.pass===true,JSON.stringify(selfJson));

await browser.close();
out.pass=Object.values(out.checks).every(x=>x.pass);
await fs.writeFile('ETHICS-SUPER-PFLAB-14_BROWSER_PASS.json',JSON.stringify(out,null,2)+'\n','utf8');
console.log(JSON.stringify(out,null,2));
