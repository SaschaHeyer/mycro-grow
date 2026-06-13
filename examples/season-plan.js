// Example: plan a full week of production across two species and print the
// substrate shopping list + projected profit.
//
//   node examples/season-plan.js
//
// The hosted version of this lives at https://usemycro.com/calculator.html
import { growPlan, substrateRecipe } from '../src/index.js';

const batches = [
  { name: 'Blue Oyster', blocks: 80, dryPerBlock: 5, be: 85, salePrice: 8 },
  { name: 'Lion\'s Mane', blocks: 30, dryPerBlock: 5, be: 60, salePrice: 16 },
];

let totalProfit = 0;
let totalDry = 0;

for (const b of batches) {
  const plan = growPlan({
    ...b, moisture: 60, spawnRate: 20,
    costSub: 0.50, costSpawn: 1.00, extraPerBlock: 0.50,
  });
  totalProfit += plan.economics.profit;
  totalDry += plan.totals.dry;
  console.log(`${b.name}: ${b.blocks} blocks → ~${Math.round(plan.totals.yield)} lb fresh, ` +
    `$${plan.economics.profit.toFixed(0)} profit`);
}

// Buy substrate for the whole week as one Masters Mix order:
const recipe = substrateRecipe({ preset: 'masters', basePerBlock: 5, blocks: totalDry / 5 });
console.log(`\nShopping list (Masters Mix, ${recipe.totals.blocks} blocks):`);
for (const ing of recipe.ingredients) console.log(`  ${ing.name}: ${ing.total.toFixed(0)} lb`);
console.log(`\nProjected weekly profit: $${totalProfit.toFixed(0)}`);
