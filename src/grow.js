// mycro-grow — core grow math for gourmet & functional mushroom farms.
// Pure functions, zero dependencies. This is the same math the free Grow
// Calculator at https://usemycro.com/calculator.html runs in the browser.
//
// Unit policy: the library is unit-agnostic but *internally consistent*.
// Pass masses in one unit (kg or lb) and prices per that same unit. Every
// returned mass is in the same unit you passed in.

const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

/**
 * Water needed to hydrate a dry substrate to a target moisture content, and
 * the resulting hydrated mass.
 *
 *   water = M * dry / (1 - M)        (so final moisture == M exactly)
 *   hydrated = dry + water
 *
 * Moisture is clamped to a sane field range of 40%–75%.
 *
 * @param {number} dryMass        dry substrate mass (any consistent unit)
 * @param {number} moisturePct    target moisture content, percent (40–75)
 * @returns {{water:number, hydrated:number, moisture:number}}
 */
export function hydration(dryMass, moisturePct) {
  const dry = Math.max(0, dryMass);
  const M = clamp(moisturePct / 100, 0.40, 0.75);
  const water = 1 - M > 0 ? (M * dry) / (1 - M) : 0;
  return { water, hydrated: dry + water, moisture: M };
}

/**
 * Grain spawn to add, by spawn rate (percent of the hydrated substrate mass),
 * plus the human-readable spawn ratio "1 : N".
 *
 * @param {number} hydratedMass   hydrated substrate mass
 * @param {number} spawnRatePct   spawn rate, percent of hydrated mass (e.g. 20)
 * @returns {{spawn:number, rate:number, ratio:string}}
 */
export function spawn(hydratedMass, spawnRatePct) {
  const r = Math.max(0, spawnRatePct) / 100;
  const spawnMass = Math.max(0, hydratedMass) * r;
  return { spawn: spawnMass, rate: r, ratio: r > 0 ? `1 : ${(1 / r).toFixed(1)}` : '—' };
}

/**
 * Expected fresh yield from biological efficiency.
 *
 *   yield(fresh) = dry substrate * (BE / 100)
 *
 * Biological efficiency (BE) is fresh harvest weight as a percent of the dry
 * substrate weight. See https://usemycro.com/guides/biological-efficiency.html
 *
 * @param {number} dryMass   dry substrate mass
 * @param {number} bePct     biological efficiency, percent (e.g. 85)
 * @returns {number} fresh yield in the same unit as dryMass
 */
export function yieldFromBE(dryMass, bePct) {
  return Math.max(0, dryMass) * (Math.max(0, bePct) / 100);
}

/**
 * Per-batch economics. All masses must be in the same unit; all prices must be
 * per that same unit (e.g. masses in lb, prices in $/lb).
 *
 * @param {object} o
 * @param {number} o.totalDry      total dry substrate mass
 * @param {number} o.totalSpawn    total spawn mass
 * @param {number} o.totalYield    total fresh yield
 * @param {number} o.blocks        number of blocks/bags
 * @param {number} [o.costSub=0]   substrate cost per unit mass
 * @param {number} [o.costSpawn=0] spawn cost per unit mass
 * @param {number} [o.extraPerBlock=0] other cost per block (bags, labor, etc.)
 * @param {number} [o.salePrice=0] sale price per unit mass of fresh yield
 * @returns {{totalCost:number, costPerBlock:number, revenue:number,
 *            profit:number, margin:number, costPerUnitYield:(number|null)}}
 */
export function economics(o) {
  const blocks = Math.max(0, Math.round(o.blocks || 0));
  const costSub = (o.totalDry || 0) * (o.costSub || 0);
  const costSpawn = (o.totalSpawn || 0) * (o.costSpawn || 0);
  const extra = (o.extraPerBlock || 0) * blocks;
  const totalCost = costSub + costSpawn + extra;
  const revenue = (o.totalYield || 0) * (o.salePrice || 0);
  const profit = revenue - totalCost;
  return {
    totalCost,
    costPerBlock: blocks > 0 ? totalCost / blocks : 0,
    revenue,
    profit,
    margin: revenue > 0 ? (profit / revenue) * 100 : 0,
    costPerUnitYield: (o.totalYield || 0) > 0 ? totalCost / o.totalYield : null,
  };
}

/**
 * Full grow plan for a batch: hydration + spawn + yield + economics, per block
 * and totalled across the batch. Mirrors usemycro.com's Grow Calculator.
 *
 * @param {object} o
 * @param {number} o.dryPerBlock   dry substrate per block
 * @param {number} o.blocks        number of blocks
 * @param {number} [o.moisture=60] target moisture %
 * @param {number} [o.spawnRate=20] spawn rate % of hydrated mass
 * @param {number} [o.be=85]       biological efficiency %
 * @param {number} [o.costSub=0]   substrate cost per unit mass
 * @param {number} [o.costSpawn=0] spawn cost per unit mass
 * @param {number} [o.extraPerBlock=0] other cost per block
 * @param {number} [o.salePrice=0] sale price per unit mass
 * @returns {object} { perBlock, totals, economics }
 */
export function growPlan(o) {
  const blocks = Math.max(0, Math.round(o.blocks || 0));
  const dry = Math.max(0, o.dryPerBlock || 0);
  const h = hydration(dry, o.moisture ?? 60);
  const s = spawn(h.hydrated, o.spawnRate ?? 20);
  const y = yieldFromBE(dry, o.be ?? 85);

  const perBlock = {
    dry,
    water: h.water,
    hydrated: h.hydrated,
    spawn: s.spawn,
    spawnRatio: s.ratio,
    yield: y,
  };
  const totals = {
    dry: dry * blocks,
    water: h.water * blocks,
    hydrated: h.hydrated * blocks,
    spawn: s.spawn * blocks,
    yield: y * blocks,
    blocks,
  };
  const econ = economics({
    totalDry: totals.dry,
    totalSpawn: totals.spawn,
    totalYield: totals.yield,
    blocks,
    costSub: o.costSub,
    costSpawn: o.costSpawn,
    extraPerBlock: o.extraPerBlock,
    salePrice: o.salePrice,
  });

  return { perBlock, totals, economics: econ };
}
