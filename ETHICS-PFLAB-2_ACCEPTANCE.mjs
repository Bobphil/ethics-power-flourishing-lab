import fs from "node:fs";
import assert from "node:assert/strict";

const contract=JSON.parse(fs.readFileSync(new URL("./ETHICS-PFLAB-2_CONTRACT.json", import.meta.url),"utf8"));
const legacy=fs.readFileSync(new URL("./ETHICS-PFLAB-INTEGRATION-1.html", import.meta.url),"utf8");

const expectedTools=[
  "Ethical Attention / First Map Audit",
  "Examination / Reason-Giving Audit",
  "Formation / Practical-Wisdom Audit",
  "Control / Desire / Moral-Range Audit",
  "Moral Authority / Common-Good Audit",
  "Legitimacy / Standing Audit",
  "Perspective / Moral-Visibility Audit",
  "Respect / Duty / Autonomy Audit",
  "Consequence / Welfare / Harm Audit",
  "Background Power / Genealogy Audit",
  "Fair-Structure / Veil-of-Ignorance Audit",
  "Dependency / Effective-Capability Audit"
];

assert.equal(contract.build_id,"ETHICS-PFLAB-2");
assert.equal(contract.source_book,"ETHICS-PB-PROD-3");
assert.equal(contract.case.id,"PATHWAY-SUPPORT-SYSTEM");
assert.equal(contract.chapter12_boundary.chapter12_case,"Maathai / Green Belt Movement + Kijani");
assert.notEqual(contract.chapter12_boundary.chapter12_case,contract.chapter12_boundary.pflab_case);
assert.equal(contract.organizing_questions.firewall,"Power and Flourishing are organizing questions, not Tools 13 and 14.");
assert.deepEqual(contract.canonical_tools,expectedTools);
assert.deepEqual(contract.lab_grammar,["MAP","TRIAGE","SELECT","SEQUENCE","JUDGE","REPAIR","REOPEN"]);
assert.equal(contract.selection_rule.minimum,3);
assert.equal(contract.selection_rule.maximum,5);
assert.equal(contract.selection_rule.all_twelve_forbidden_as_default,true);

for(const x of [
  "bounded_judgment","standing_and_authorization","repair_proposal","capability_effects",
  "burden_shift_check","claim_ceiling","reopen_conditions","authorial_return"
]) assert.ok(contract.required_record_fields.includes(x),x);

for(const x of [
  "Map ≠ World ≠ Person",
  "Generate ≠ Recommend ≠ Authorize",
  "Current judgment ≠ final closure"
]) assert.ok(contract.fsp_under_the_hood.safeguards.includes(x),x);

for(const x of expectedTools) assert.ok(legacy.includes(x),"legacy-missing-tool:"+x);
assert.ok(legacy.includes("SELECT 3–5 primary Tools"));
assert.ok(legacy.includes("MAP → TRIAGE → SELECT → SEQUENCE → JUDGE → REPAIR → REOPEN"));
assert.ok(legacy.includes("They are organizing questions, not Tools 13 and 14."));
assert.ok(legacy.includes("ETHICS-PFLAB-HANDOFF-1"));

console.log("ETHICS-PFLAB-2 acceptance PASS");
console.log("canonical tools: 12/12");
console.log("selection rule: 3–5");
console.log("chapter12 transfer boundary: PASS");
console.log("legacy compatibility baseline: PASS");
