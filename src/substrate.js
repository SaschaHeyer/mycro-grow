// mycro-grow — substrate recipe math. Same logic as the free Substrate Recipe
// Calculator at https://usemycro.com/substrate-calculator.html
//
// A recipe splits a dry "base" (the bulk substrate) into sawdust + soy hull by
// weight percent, then adds bran and gypsum as a percent of the base, then adds
// water to hit a target moisture. The `straw` preset treats the whole base as
// straw pellets (no sawdust/soy-hull split).

const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

/** Named recipe presets (percent weights). */
export const PRESETS = {
  // 50/50 hardwood sawdust + soy hull pellets, 1% gypsum — the workhorse.
  masters: { pSaw: 50, pSoy: 50, pBran: 0, pGyp: 1 },
  // 100% sawdust, supplemented with 20% bran, 1% gypsum.
  suppsaw: { pSaw: 100, pSoy: 0, pBran: 20, pGyp: 1 },
  // 100% soy hull pellets, 1% gypsum.
  soyhull: { pSaw: 0, pSoy: 100, pBran: 0, pGyp: 1 },
  // 100% straw pellets, no supplementation.
  straw: { pSaw: 0, pSoy: 0, pBran: 0, pGyp: 0, straw: true },
};

/**
 * Compute a substrate recipe for a batch of blocks.
 *
 * @param {object} o
 * @param {string} [o.preset]      one of PRESETS keys; or omit and pass weights
 * @param {number} o.basePerBlock  dry base mass per block (any consistent unit)
 * @param {number} o.blocks        number of blocks
 * @param {number} [o.moisture=60] target moisture %, clamped 40–75
 * @param {number} [o.pSaw]        sawdust % of base (ignored if preset given)
 * @param {number} [o.pSoy]        soy hull % of base
 * @param {number} [o.pBran]       bran % of base dry mass
 * @param {number} [o.pGyp]        gypsum % of base dry mass
 * @param {boolean}[o.straw]       treat whole base as straw pellets
 * @returns {{perBlock:object, totals:object, ingredients:Array, warnings:string[]}}
 */
export function substrateRecipe(o) {
  const p = o.preset ? PRESETS[o.preset] : null;
  if (o.preset && !p) throw new Error(`Unknown preset "${o.preset}". Use one of: ${Object.keys(PRESETS).join(', ')}`);

  const blocks = Math.max(0, Math.round(o.blocks || 0));
  const base = Math.max(0, o.basePerBlock || 0);
  const isStraw = Boolean(p ? p.straw : o.straw);
  const pSaw = Math.max(0, (p ? p.pSaw : o.pSaw) || 0);
  const pSoy = Math.max(0, (p ? p.pSoy : o.pSoy) || 0);
  const pBran = Math.max(0, (p ? p.pBran : o.pBran) || 0);
  const pGyp = Math.max(0, (p ? p.pGyp : o.pGyp) || 0);
  const M = clamp((o.moisture ?? 60) / 100, 0.40, 0.75);

  const warnings = [];
  const sum = pSaw + pSoy;
  if (!isStraw && sum > 0 && Math.abs(sum - 100) > 0.5) {
    warnings.push(`sawdust % + soy hull % = ${sum}% (not 100%). The base is split by these weights as entered — adjust so they total 100% for a standard recipe.`);
  }

  const sawPB = base * (pSaw / 100);
  const soyPB = base * (pSoy / 100);
  const strawPB = isStraw ? base : 0;
  const baseDryPB = isStraw ? strawPB : sawPB + soyPB;
  const branPB = baseDryPB * (pBran / 100);
  const gypPB = baseDryPB * (pGyp / 100);
  const totalDryPB = baseDryPB + branPB + gypPB;
  const waterPB = 1 - M > 0 ? (M * totalDryPB) / (1 - M) : 0;
  const hydPB = totalDryPB + waterPB;

  const ingredients = [];
  const add = (name, perBlock) => { if (perBlock > 0) ingredients.push({ name, perBlock, total: perBlock * blocks }); };
  if (isStraw) add('Straw pellets', strawPB);
  else { add('Hardwood sawdust', sawPB); add('Soy hull pellets', soyPB); }
  add('Bran (wheat/oat)', branPB);
  add('Gypsum', gypPB);

  return {
    perBlock: { totalDry: totalDryPB, water: waterPB, hydrated: hydPB },
    totals: { totalDry: totalDryPB * blocks, water: waterPB * blocks, hydrated: hydPB * blocks, blocks },
    ingredients,
    warnings,
  };
}
