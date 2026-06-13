# 🍄 mycro-grow

**Grow math for gourmet & functional mushroom farms** — hydration, spawn ratio,
biological-efficiency yield, batch economics, substrate recipes, and fruiting-condition
data for 14 species. Zero dependencies, MIT licensed.

This is the open-source engine behind the free calculators at **[usemycro.com](https://usemycro.com)**.
Everything here already runs client-side in those tools; this package makes the same math
reusable in your own scripts, spreadsheets-replacements, and grow-ops automation.

---

## Why

Small mushroom farms run their numbers by hand or in fragile spreadsheets: how much water to
add to hit field capacity, how much grain spawn at a 1:5 ratio, what yield to expect from a
given biological efficiency, and whether a batch actually makes money. `mycro-grow` packages
that math as clean, tested functions so you can stop re-deriving it.

## Install

```bash
npm install mycro-grow
```

Or just clone it — it's a handful of dependency-free ES modules.

## Quick start

```js
import { growPlan, substrateRecipe, FRUITING_CONDITIONS } from 'mycro-grow';

// Plan a 100-block oyster batch (5 lb dry each, 60% moisture, 20% spawn, 85% BE)
const plan = growPlan({
  dryPerBlock: 5, blocks: 100, moisture: 60, spawnRate: 20, be: 85,
  costSub: 0.50, costSpawn: 1.00, extraPerBlock: 0.50, salePrice: 8,
});
console.log(plan.totals.yield);          // 425  (lb fresh)
console.log(plan.perBlock.spawnRatio);   // "1 : 5.0"
console.log(plan.economics.profit);      // 2850
```

> **Units:** the library is unit-agnostic but *internally consistent*. Pass masses in one unit
> (kg or lb) and prices per that same unit (e.g. `$/lb`). Every returned mass is in that unit.

## CLI

```bash
npx mycro-grow plan --dry 5 --blocks 100 --moisture 60 --spawn 20 --be 85 \
  --cost-sub 0.50 --cost-spawn 1.00 --extra 0.50 --price 8
```

```
Batch: 100 blocks @ 5 dry each

Per block:
  water needed   7.5
  hydrated mass  12.5
  spawn to add   2.5   (ratio 1 : 5.0)
  expected yield 4.25

Batch totals:
  dry substrate  500
  water          750
  spawn          250
  fresh yield    425

Economics:
  total cost     $550.00   ($5.50/block)
  revenue        $3,400.00
  profit         $2,850.00   (83.82% margin)
```

Scale a Masters Mix recipe to 100 blocks:

```bash
npx mycro-grow substrate --preset masters --base 5 --blocks 100
```

```
Recipe: masters · 100 blocks

  Ingredient            per block      total
  Hardwood sawdust          2.5        250
  Soy hull pellets          2.5        250
  Gypsum                   0.05          5
  — Total dry              5.05        505
  Water                    7.57      757.5
```

List fruiting conditions for all 14 species:

```bash
npx mycro-grow species
```

## API

| Function | What it returns |
|---|---|
| `hydration(dryMass, moisturePct)` | `{ water, hydrated, moisture }` — water to add to hit a target moisture (clamped 40–75%) and the resulting hydrated mass |
| `spawn(hydratedMass, spawnRatePct)` | `{ spawn, rate, ratio }` — grain spawn to add and the `"1 : N"` ratio |
| `yieldFromBE(dryMass, bePct)` | fresh yield = dry substrate × BE% |
| `economics({...})` | `{ totalCost, costPerBlock, revenue, profit, margin, costPerUnitYield }` |
| `growPlan({...})` | the whole batch: `{ perBlock, totals, economics }` |
| `substrateRecipe({...})` | `{ perBlock, totals, ingredients, warnings }` — scale a recipe to N blocks |
| `PRESETS` | named recipes: `masters`, `suppsaw`, `soyhull`, `straw` |
| `SPECIES_BE` | typical biological-efficiency % by species |
| `FRUITING_CONDITIONS` | array of 14 species with temp / RH / CO₂ / FAE / light / BE |

### The formulas (no black box)

- **Hydration:** `water = M·dry / (1 − M)`, so final moisture is exactly `M`.
- **Spawn:** `spawn = hydrated × rate`; ratio is `1 : (1/rate)`.
- **Yield:** `freshYield = dry × (BE / 100)`. Biological efficiency is fresh harvest weight as a
  percent of dry substrate weight.
- **Substrate:** the dry *base* is split into sawdust + soy hull by weight %, then bran and
  gypsum are added as a % of the base, then water to the target moisture.

## Run the tests

```bash
npm test          # node --test — 12 passing
```

## The hosted app

`mycro-grow` is the math layer. If you'd rather just open a page and get answers — or you want
the same numbers across a whole season without wiring anything up — the free hosted tools are at
**[usemycro.com](https://usemycro.com)**:

- **[Grow Calculator](https://usemycro.com/calculator.html)** — substrate, spawn, yield & profit per batch
- **[Substrate Recipe Calculator](https://usemycro.com/substrate-calculator.html)** — scale any recipe to N blocks
- **[Fruiting Conditions cheat-sheet](https://usemycro.com/fruiting-conditions.html)** — temp/RH/CO₂/FAE/light for 14 species
- **[Growing guides](https://usemycro.com/guides/)** — biological efficiency, spawn ratio, field capacity, contamination, and more

[Mycro](https://usemycro.com) is building grow-operations software for small gourmet & functional
mushroom farms — tracking batches from spawn to flush. Early access is open via the waitlist.

## Scope

Legal **culinary and functional/medicinal** mushroom cultivation only (oyster, lion's mane,
shiitake, reishi, etc.). Not for psilocybin or any controlled species.

## License

MIT © [Mycro](https://usemycro.com)
