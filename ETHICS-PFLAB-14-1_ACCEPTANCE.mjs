import fs from 'node:fs';

const file = process.argv[2] || 'ETHICS-PFLAB-14-1.html';
const html = fs.readFileSync(file,'utf8');
const checks = [];
const check = (name, ok, detail='') => checks.push({name, ok:!!ok, detail});

function extractAssigned(marker, open, close){
  const start=html.indexOf(marker);
  if(start<0) throw new Error('Missing '+marker);
  const js=html.indexOf(open,start);
  let depth=0,inStr=false,esc=false,end=-1;
  for(let i=js;i<html.length;i++){
    const ch=html[i];
    if(inStr){
      if(esc){esc=false;continue;}
      if(ch==='\\'){esc=true;continue;}
      if(ch==='"') inStr=false;
    }else{
      if(ch==='"') inStr=true;
      else if(ch===open) depth++;
      else if(ch===close){depth--; if(depth===0){end=i+1;break;}}
    }
  }
  if(end<0) throw new Error('Unclosed '+marker);
  return JSON.parse(html.slice(js,end));
}

const tools = extractAssigned('const TOOLS=','[',']');
const legacy = extractAssigned('const MOCK_HANDOFF_LEGACY12=','{','}');
const current = extractAssigned('const MOCK_HANDOFF_14=','{','}');

function validate(h){
 const errors=[];
 if(!h||typeof h!=='object') errors.push('Not object');
 if(h?.handoff_schema!=='ETHICS-PFLAB-HANDOFF-1') errors.push('schema');
 const source=h?.source_build, content=h?.content_version;
 const tr=h?.tool_record&&typeof h.tool_record==='object'?Object.keys(h.tool_record):[];
 const oc=h?.output_cards&&typeof h.output_cards==='object'?Object.keys(h.output_cards):[];
 const isCurrent14=source==='ETHICS-SUPER-14-1' && content==='ETHICS-BEYOND-BOUNDARIES-14CH-2026-11-22';
 const isLegacy12=['ETHICS-SUPER-FINAL-1','ETHICS-SUPER-REDO-1'].includes(source) && ['ETHICS-PB-PROD-2','ETHICS-PB-PROD-3'].includes(content);
 if(!isCurrent14&&!isLegacy12) errors.push('profile');
 if(h?.ready!==true) errors.push('not ready');
 const expected=isCurrent14?14:isLegacy12?12:0;
 if(expected&&tr.length!==expected) errors.push('tool count');
 if(expected&&oc.length!==expected) errors.push('card count');
 for(const t of tools.slice(0,expected)) if(!h?.tool_record?.[t.tool_id]) errors.push('missing '+t.tool_id);
 return {ok:errors.length===0,errors,profile:isCurrent14?'CURRENT_14':isLegacy12?'LEGACY_12':'INVALID',toolCount:tr.length,cardCount:oc.length};
}

check('build id', /const BUILD='ETHICS-PFLAB-14-1'/.test(html));
check('14 tools', tools.length===14, String(tools.length));
check('CH13 canonical', tools[12]?.tool_id==='TOOL-CH13' && tools[12]?.name==='Agency-Conditions / Responsibility Audit');
check('CH14 canonical', tools[13]?.tool_id==='TOOL-CH14' && tools[13]?.name==='Moral-Circle / Enclosure / Shared-Task Audit');
check('current 14 fixture valid', validate(current).ok, JSON.stringify(validate(current)));
check('current 14 fixture counts', validate(current).toolCount===14 && validate(current).cardCount===14);
check('legacy 12 fixture valid', validate(legacy).ok, JSON.stringify(validate(legacy)));
check('legacy 12 profile explicit', validate(legacy).profile==='LEGACY_12');
check('legacy lacks CH13 record', !legacy.tool_record['TOOL-CH13']);
check('legacy lacks CH14 record', !legacy.tool_record['TOOL-CH14']);
const broken14=structuredClone(current); delete broken14.tool_record['TOOL-CH14'];
check('reject incomplete current handoff', !validate(broken14).ok);
const brokenCount=structuredClone(current); delete brokenCount.output_cards['CH14'];
check('reject 13-card current handoff', !validate(brokenCount).ok);
const notReady=structuredClone(current); notReady.ready=false;
check('reject not-ready current handoff', !validate(notReady).ok);
check('new record schema', /ETHICS-PFLAB-RECORD-14-1/.test(html));
check('new recovery schema', /ETHICS-PFLAB-RECOVERY-14-1/.test(html));
check('old recovery accepted', /ETHICS-PFLAB-RECOVERY-1/.test(html) && /ETHICS-PFLAB-RECOVERY-2/.test(html));
check('legacy local storage migration', /ethics\.pflab\.2/.test(html) && /ethics\.pflab\.integration1/.test(html));
check('power and flourishing not additional tools', /organizing questions, not additional Tools/i.test(html) && !tools.some(t=>/Power and Flourishing/.test(t.name)));
check('3–5 selection rule retained', /Select 3–5 primary Tools/.test(html));
check('lab grammar retained', /MAP → TRIAGE → SELECT → SEQUENCE → JUDGE → REPAIR → REOPEN/.test(html));
check('current course says after Chapter 14', /after Chapter 14 and the course Closing/.test(html));
check('current handoff requires 14 READY', /all fourteen chapter Output Cards/.test(html));
check('legacy compatibility UI', /unavailable in legacy 12-tool handoff/.test(html));
check('browser API exposed', /__ETHICS_PFLAB_14_1__/.test(html));

const passed=checks.filter(x=>x.ok).length;
const out={build:'ETHICS-PFLAB-14-1',passed,total:checks.length,pass:passed===checks.length,checks};
console.log(JSON.stringify(out,null,2));
process.exit(out.pass?0:1);
