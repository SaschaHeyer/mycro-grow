#!/usr/bin/env node
// mycro-grow CLI — plan a batch or a substrate recipe from the command line.
// Part of the open-source grow math behind https://usemycro.com
import { growPlan, substrateRecipe, PRESETS, FRUITING_CONDITIONS, SPECIES_BE } from '../src/index.js';

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) { out[key] = true; }
      else { out[key] = isNaN(Number(next)) ? next : Number(next); i++; }
    } else out._.push(a);
  }
  return out;
}

const HELP = `mycro-grow — grow math for gourmet & functional mushroom farms
the open-source engine behind https://usemycro.com

USAGE
  mycro-grow plan      [options]   estimate water, spawn, yield & profit for a batch
  mycro-grow substrate [options]   scale a substrate recipe to N blocks
  mycro-grow species               list fruiting conditions & BE for 14 species

PLAN options (masses & prices in any one consistent unit, e.g. lb + $/lb)
  --dry <n>        dry substrate per block        (default 5)
  --blocks <n>     number of blocks               (default 100)
  --moisture <n>   target moisture %, 40-75       (default 60)
  --spawn <n>      spawn rate % of hydrated mass   (default 20)
  --be <n>         biological efficiency %         (default 85)
  --cost-sub <n>   substrate cost per unit mass    (default 0)
  --cost-spawn <n> spawn cost per unit mass        (default 0)
  --extra <n>      other cost per block            (default 0)
  --price <n>      sale price per unit mass        (default 0)
  --json           print raw JSON

SUBSTRATE options
  --preset <name>  masters | suppsaw | soyhull | straw
  --base <n>       dry base per block              (default 5)
  --blocks <n>     number of blocks                (default 100)
  --moisture <n>   target moisture %               (default 60)
  --json           print raw JSON
`;

const r2 = (x) => Math.round(x * 100) / 100;
const money = (x) => '$' + (x ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function cmdPlan(a) {
  const p = growPlan({
    dryPerBlock: a.dry ?? 5, blocks: a.blocks ?? 100, moisture: a.moisture ?? 60,
    spawnRate: a.spawn ?? 20, be: a.be ?? 85,
    costSub: a['cost-sub'] ?? 0, costSpawn: a['cost-spawn'] ?? 0,
    extraPerBlock: a.extra ?? 0, salePrice: a.price ?? 0,
  });
  if (a.json) return console.log(JSON.stringify(p, null, 2));
  console.log(`\nBatch: ${p.totals.blocks} blocks @ ${a.dry ?? 5} dry each\n`);
  console.log('Per block:');
  console.log(`  water needed   ${r2(p.perBlock.water)}`);
  console.log(`  hydrated mass  ${r2(p.perBlock.hydrated)}`);
  console.log(`  spawn to add   ${r2(p.perBlock.spawn)}   (ratio ${p.perBlock.spawnRatio})`);
  console.log(`  expected yield ${r2(p.perBlock.yield)}`);
  console.log('\nBatch totals:');
  console.log(`  dry substrate  ${r2(p.totals.dry)}`);
  console.log(`  water          ${r2(p.totals.water)}`);
  console.log(`  spawn          ${r2(p.totals.spawn)}`);
  console.log(`  fresh yield    ${r2(p.totals.yield)}`);
  console.log('\nEconomics:');
  console.log(`  total cost     ${money(p.economics.totalCost)}   (${money(p.economics.costPerBlock)}/block)`);
  console.log(`  revenue        ${money(p.economics.revenue)}`);
  console.log(`  profit         ${money(p.economics.profit)}   (${r2(p.economics.margin)}% margin)\n`);
}

function cmdSubstrate(a) {
  const recipe = substrateRecipe({
    preset: a.preset, basePerBlock: a.base ?? 5, blocks: a.blocks ?? 100, moisture: a.moisture ?? 60,
  });
  if (a.json) return console.log(JSON.stringify(recipe, null, 2));
  console.log(`\nRecipe: ${a.preset || 'custom'} · ${recipe.totals.blocks} blocks\n`);
  console.log('  Ingredient            per block      total');
  for (const ing of recipe.ingredients) {
    console.log(`  ${ing.name.padEnd(20)} ${String(r2(ing.perBlock)).padStart(8)} ${String(r2(ing.total)).padStart(10)}`);
  }
  console.log(`  ${'— Total dry'.padEnd(20)} ${String(r2(recipe.perBlock.totalDry)).padStart(8)} ${String(r2(recipe.totals.totalDry)).padStart(10)}`);
  console.log(`  ${'Water'.padEnd(20)} ${String(r2(recipe.perBlock.water)).padStart(8)} ${String(r2(recipe.totals.water)).padStart(10)}`);
  recipe.warnings.forEach((w) => console.log(`\n  ! ${w}`));
  console.log();
}

function cmdSpecies() {
  console.log('\n14 gourmet & functional species — fruiting conditions (temps °C):\n');
  for (const s of FRUITING_CONDITIONS) {
    console.log(`  ${s.name}  (${s.latin}) — ${s.difficulty}`);
    console.log(`    fruit ${s.fruitC[0]}-${s.fruitC[1]}°C · RH ${s.humidity} · CO2 ${s.co2} · FAE ${s.fae} · BE ${s.be}`);
  }
  console.log('\nFull cheat-sheet with search & °F: https://usemycro.com/fruiting-conditions.html\n');
}

const argv = process.argv.slice(2);
const cmd = argv[0];
const a = parseArgs(argv.slice(1));
if (!cmd || a.help || cmd === 'help' || cmd === '--help') console.log(HELP);
else if (cmd === 'plan') cmdPlan(a);
else if (cmd === 'substrate') cmdSubstrate(a);
else if (cmd === 'species') cmdSpecies();
else { console.error(`Unknown command "${cmd}".\n`); console.log(HELP); process.exit(1); }
