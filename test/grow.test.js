import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hydration, spawn, yieldFromBE, economics, growPlan,
  substrateRecipe, PRESETS, SPECIES_BE, FRUITING_CONDITIONS,
} from '../src/index.js';

const close = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

test('hydration hits the target moisture exactly', () => {
  const { water, hydrated, moisture } = hydration(5, 60);
  // water = 0.6 * 5 / 0.4 = 7.5 ; hydrated = 12.5 ; final moisture = 7.5/12.5 = 0.6
  assert.ok(close(water, 7.5));
  assert.ok(close(hydrated, 12.5));
  assert.ok(close(moisture, 0.6));
  assert.ok(close(water / hydrated, 0.6));
});

test('hydration clamps moisture to the 40-75% field range', () => {
  assert.ok(close(hydration(10, 90).moisture, 0.75));
  assert.ok(close(hydration(10, 10).moisture, 0.40));
});

test('spawn rate gives the right mass and ratio', () => {
  const s = spawn(12.5, 20); // 20% of 12.5 = 2.5 ; ratio 1 : 5.0
  assert.ok(close(s.spawn, 2.5));
  assert.equal(s.ratio, '1 : 5.0');
  assert.equal(spawn(10, 0).ratio, '—');
});

test('yield from biological efficiency', () => {
  assert.ok(close(yieldFromBE(5, 85), 4.25)); // 5 * 0.85
  assert.ok(close(yieldFromBE(5, 100), 5));
});

test('economics: profit, margin and per-block cost', () => {
  // 100 blocks, total dry 500 @ $0.50 = $250 ; spawn 250 @ $1 = $250 ; yield 425 @ $8 = $3400
  const e = economics({ totalDry: 500, totalSpawn: 250, totalYield: 425, blocks: 100, costSub: 0.5, costSpawn: 1, extraPerBlock: 0.5, salePrice: 8 });
  assert.ok(close(e.totalCost, 250 + 250 + 50)); // 550
  assert.ok(close(e.revenue, 3400));
  assert.ok(close(e.profit, 2850));
  assert.ok(close(e.costPerBlock, 5.5));
  assert.ok(close(e.margin, (2850 / 3400) * 100));
  assert.ok(close(e.costPerUnitYield, 550 / 425));
});

test('growPlan ties hydration + spawn + yield + economics together', () => {
  const p = growPlan({ dryPerBlock: 5, blocks: 100, moisture: 60, spawnRate: 20, be: 85, costSub: 0.5, costSpawn: 1, salePrice: 8 });
  assert.ok(close(p.perBlock.water, 7.5));
  assert.ok(close(p.perBlock.spawn, 2.5));
  assert.ok(close(p.perBlock.yield, 4.25));
  assert.ok(close(p.totals.yield, 425));
  assert.equal(p.totals.blocks, 100);
  assert.ok(p.economics.profit > 0);
});

test("masters mix preset splits base 50/50 and adds 1% gypsum", () => {
  const r = substrateRecipe({ preset: 'masters', basePerBlock: 5, blocks: 10, moisture: 60 });
  const names = r.ingredients.map((i) => i.name);
  assert.deepEqual(names, ['Hardwood sawdust', 'Soy hull pellets', 'Gypsum']);
  assert.ok(close(r.ingredients[0].perBlock, 2.5)); // 50% of 5
  assert.ok(close(r.ingredients[1].perBlock, 2.5)); // 50% of 5
  assert.ok(close(r.ingredients[2].perBlock, 0.05)); // 1% of base dry (5)
  assert.ok(close(r.totals.totalDry, (5 + 0.05) * 10));
  assert.equal(r.warnings.length, 0);
});

test('suppsaw preset adds 20% bran', () => {
  const r = substrateRecipe({ preset: 'suppsaw', basePerBlock: 10, blocks: 1 });
  const bran = r.ingredients.find((i) => i.name.startsWith('Bran'));
  assert.ok(close(bran.perBlock, 2)); // 20% of 10
});

test('straw preset treats the whole base as straw pellets', () => {
  const r = substrateRecipe({ preset: 'straw', basePerBlock: 8, blocks: 1 });
  assert.equal(r.ingredients[0].name, 'Straw pellets');
  assert.ok(close(r.ingredients[0].perBlock, 8));
});

test('custom recipe whose base split != 100% warns', () => {
  const r = substrateRecipe({ pSaw: 60, pSoy: 60, basePerBlock: 5, blocks: 1 });
  assert.equal(r.warnings.length, 1);
});

test('unknown preset throws a helpful error', () => {
  assert.throws(() => substrateRecipe({ preset: 'nope', basePerBlock: 5, blocks: 1 }), /Unknown preset/);
});

test('data exports are present and well-formed', () => {
  assert.equal(FRUITING_CONDITIONS.length, 14);
  assert.ok(SPECIES_BE['Shiitake'] === 90);
  for (const s of FRUITING_CONDITIONS) {
    assert.ok(s.name && s.latin && Array.isArray(s.fruitC) && s.fruitC.length === 2);
  }
  assert.ok(Object.keys(PRESETS).includes('masters'));
});
