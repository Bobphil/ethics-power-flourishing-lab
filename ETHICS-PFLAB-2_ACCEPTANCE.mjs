import fs from "node:fs";
import assert from "node:assert/strict";

const html=fs.readFileSync(new URL("./ETHICS-PFLAB-2.html",import.meta.url),"utf8");
const contract=JSON.parse(fs.readFileSync(new URL("./ETHICS-PFLAB-2_CONTRACT.json",import.meta.url),"utf8"));

const report={suites:{},pass:true};
function suite(name,checks){const failures=[];for(const [label,ok] of checks){if(!ok)failures.push(label)}report.suites[name]={checks:checks.length,failures,pass:failures.length===0};if(failures.length)report.pass=false}

const toolNames=contract.canonical_tools;
suite("handoff",[
 ["schema",html.includes("ETHICS-PFLAB-HANDOFF-1")],
 ["source build",html.includes("ETHICS-SUPER-FINAL-1")],
 ["12 tool validation",html.includes("Expected 12 Tool Record entries")],
 ["prod2 compatibility",html.includes("ETHICS-PB-PROD-2")],
 ["prod3 current",html.includes("ETHICS-PB-PROD-3")],
 ["3-5 selection",html.includes("SELECT 3–5 primary Tools")],
 ...toolNames.map(x=>["tool:"+x,html.includes(x)])
]);

suite("persistence",[
 ["new storage key",html.includes("ethics.pflab.2")],
 ["legacy migration",html.includes("ethics.pflab.integration1")&&html.includes("migrated_from")],
 ["save localStorage",html.includes("localStorage.setItem(STORAGE")],
 ["load localStorage",html.includes("localStorage.getItem(STORAGE")],
 ["recovery v2",html.includes("ETHICS-PFLAB-RECOVERY-2")],
 ["legacy recovery accepted",html.includes("ETHICS-PFLAB-RECOVERY-1")]
]);

const requiredFields=[
 "map","affected_people_institutions","power_map","established","inferred","unknown","provenance","triage",
 "sequence_rationale","judgment_status","recommendation","judgment_warrant","standing_authorization","claim_ceiling","bounded_action",
 "repair_failure","repair_intervention","repair_actor","repair_improvement","capability_effects","repair_burden","repair_evidence",
 "reopen_evidence","reopen_standing","reopen_burden","reopen_scope","authorial_return"
];
suite("usability",[
 ["9 routes",(html.match(/<button data-route=/g)||[]).length===9],
 ["all fields present",requiredFields.every(x=>html.includes('data-field="'+x+'"'))],
 ["record schema",html.includes("ETHICS-PFLAB-RECORD-2")],
 ["clear completion feedback",html.includes("LAB RECORD COMPLETE")&&html.includes("RECORD IN PROGRESS")],
 ["tool rationale four-part",["fit","question","contribution","limit"].every(x=>html.includes(x))]
]);

const externalHref=[...html.matchAll(/href=["']([^"']+)["']/g)].map(m=>m[1]).filter(x=>/^https?:/i.test(x));
suite("links",[
 ["no unresolved external dependencies",externalHref.length===0],
 ["no placeholder href",!html.includes('href="#"')&&!html.includes("href=''")&&!html.includes('href=""')],
 ["download URLs revoked",html.includes("URL.revokeObjectURL")]
]);

suite("accessibility",[
 ["nav label",html.includes('nav aria-label="Lab navigation"')],
 ["focus visible",html.includes("focus-visible")],
 ["reduced motion",html.includes("prefers-reduced-motion")],
 ["mobile breakpoint",html.includes("@media(max-width:850px)")],
 ["live statuses",(html.match(/aria-live="polite"/g)||[]).length>=2],
 ["pressed nav state",html.includes("aria-pressed")],
 ["readable record label",html.includes('aria-label="Readable Lab Record"')],
 ["table headings",html.includes("<th>Dimension</th>")],
 ["no images without alt",!/<img\b(?![^>]*\balt=)/i.test(html)]
]);

suite("governance",[
 ["power flourishing boundary",html.includes("They are organizing questions, not Tools 13 and 14.")],
 ["map world person",html.includes("Map ≠ World ≠ Person")],
 ["generate recommend authorize",html.includes("Generate ≠ Recommend ≠ Authorize")],
 ["capability burden firewall",html.includes("Capability expansion for one person ≠ justified capability contraction for another.")],
 ["claim ceiling",html.includes("claim_ceiling")],
 ["authorization",html.includes("standing_authorization")],
 ["authorial return",html.includes("authorial_return")],
 ["reopen",html.includes("reopen_scope")]
]);

console.log(JSON.stringify(report,null,2));
if(!report.pass) process.exit(1);
