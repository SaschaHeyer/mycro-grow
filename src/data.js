// mycro-grow — reference data for gourmet & functional mushroom species.
// Same data that powers the calculators and the Fruiting Conditions cheat-sheet
// at https://usemycro.com/fruiting-conditions.html
//
// Values are typical cultivation ranges compiled from common practice; treat
// them as starting points, not guarantees. Temperatures are in °C.

/**
 * Typical biological efficiency (%) presets by species, as used by the Grow
 * Calculator's species dropdown. BE = fresh yield as a percent of dry substrate.
 */
export const SPECIES_BE = {
  'Blue / Pearl Oyster': 85,
  'Pink / Yellow Oyster': 75,
  'King Oyster (Trumpet)': 60,
  "Lion's Mane": 60,
  'Shiitake': 90,
  'Chestnut': 60,
  'Pioppino': 60,
  'Nameko': 60,
  'Reishi': 45,
};

/**
 * Fruiting conditions for 14 gourmet & functional species.
 * Fields:
 *   name        common name
 *   latin       binomial
 *   type        loose grouping (Oyster / Wood-lover / Medicinal)
 *   difficulty  Beginner | Intermediate | Advanced
 *   colonizeC   [min,max] colonization temperature, °C
 *   fruitC      [min,max] fruiting temperature, °C
 *   humidity    relative humidity range during fruiting
 *   co2         target CO2 during fruiting
 *   fae         fresh-air-exchange need
 *   light       light need
 *   timeToFruit typical time from pinning / notes on timeline
 *   be          typical biological efficiency range
 *   note        practical tip
 */
export const FRUITING_CONDITIONS = [
  { name: 'Blue Oyster', latin: 'Pleurotus ostreatus', type: 'Oyster', difficulty: 'Beginner', colonizeC: [21, 27], fruitC: [10, 21], humidity: '85–95%', co2: '<800 ppm', fae: 'High', light: 'Moderate (12 h)', timeToFruit: '10–14 days', be: '75–100%+', note: 'The most forgiving species and a great first grow — tolerates a wide temperature band.' },
  { name: 'Pearl Oyster', latin: 'Pleurotus ostreatus', type: 'Oyster', difficulty: 'Beginner', colonizeC: [21, 27], fruitC: [13, 21], humidity: '85–95%', co2: '<800 ppm', fae: 'High', light: 'Moderate', timeToFruit: '10–14 days', be: '75–100%', note: 'The classic grey oyster; fruits a touch warmer than the blue strain.' },
  { name: 'Pink Oyster', latin: 'Pleurotus djamor', type: 'Oyster', difficulty: 'Beginner', colonizeC: [24, 30], fruitC: [18, 30], humidity: '85–95%', co2: '<800 ppm', fae: 'High', light: 'Moderate', timeToFruit: '10–14 days', be: '65–90%', note: 'Loves heat and fruits fast, but very short shelf life — sell within a day or two.' },
  { name: 'Golden / Yellow Oyster', latin: 'Pleurotus citrinopileatus', type: 'Oyster', difficulty: 'Beginner', colonizeC: [24, 30], fruitC: [21, 30], humidity: '85–95%', co2: '<800 ppm', fae: 'High', light: 'Moderate', timeToFruit: '10–14 days', be: '65–90%', note: 'Warm-season; delicate bright-yellow clusters that are fragile after harvest.' },
  { name: 'King Oyster', latin: 'Pleurotus eryngii', type: 'Oyster', difficulty: 'Intermediate', colonizeC: [22, 25], fruitC: [15, 18], humidity: '85–90%', co2: '500–800 ppm', fae: 'Moderate', light: 'Low–moderate', timeToFruit: '14–21 days', be: '50–75%', note: 'Fruit few per block for big meaty stems; a brief cold shock helps trigger pinning.' },
  { name: "Lion's Mane", latin: 'Hericium erinaceus', type: 'Wood-lover', difficulty: 'Intermediate', colonizeC: [21, 24], fruitC: [18, 24], humidity: '90–95%', co2: '<800 ppm', fae: 'High', light: 'Low', timeToFruit: '10–14 days', be: '50–75%', note: "High CO2 makes branchy 'coral' growth with no spines — keep fresh air high and humidity up." },
  { name: 'Shiitake', latin: 'Lentinula edodes', type: 'Wood-lover', difficulty: 'Advanced', colonizeC: [21, 27], fruitC: [10, 21], humidity: '80–90%', co2: '<1000 ppm', fae: 'Moderate–high', light: 'Moderate', timeToFruit: '35–70 days + browning', be: '75–125%', note: 'Long colonization, then the block must brown before fruiting. A cold-water soak triggers each flush.' },
  { name: 'Chestnut', latin: 'Pholiota adiposa', type: 'Wood-lover', difficulty: 'Intermediate', colonizeC: [21, 24], fruitC: [13, 18], humidity: '85–95%', co2: '<800 ppm', fae: 'High', light: 'Moderate', timeToFruit: '14–21 days', be: '50–75%', note: 'Crunchy, nutty, chef-favorite clusters with a nicer shelf life than oysters.' },
  { name: 'Pioppino', latin: 'Cyclocybe aegerita', type: 'Wood-lover', difficulty: 'Intermediate', colonizeC: [24, 27], fruitC: [15, 21], humidity: '85–95%', co2: '<800 ppm', fae: 'High', light: 'Moderate', timeToFruit: '14–21 days', be: '50–75%', note: 'Long elegant stems and a deep savory flavor; tolerant once fully colonized.' },
  { name: 'Nameko', latin: 'Pholiota microspora', type: 'Wood-lover', difficulty: 'Intermediate', colonizeC: [21, 24], fruitC: [10, 16], humidity: '90–95%', co2: '<800 ppm', fae: 'High', light: 'Moderate', timeToFruit: '14–30 days', be: '50–75%', note: 'Cool-fruiting with a glossy gelatinous cap; a staple in miso soup.' },
  { name: 'Enoki', latin: 'Flammulina velutipes', type: 'Wood-lover', difficulty: 'Advanced', colonizeC: [21, 24], fruitC: [8, 13], humidity: '80–90%', co2: 'High (long-stem form)', fae: 'Low (restricted)', light: 'Low', timeToFruit: '14–21 days', be: '50–75%', note: 'The white long-stem market form is grown cold in CO2-rich tubes; with fresh air you get the wild brown form.' },
  { name: 'Maitake (Hen of the Woods)', latin: 'Grifola frondosa', type: 'Wood-lover', difficulty: 'Advanced', colonizeC: [21, 24], fruitC: [13, 18], humidity: '85–95%', co2: '<800 ppm', fae: 'High', light: 'Moderate', timeToFruit: '30–60 days + initiation', be: '~30–50%', note: 'Demands extended incubation and a cool initiation — one of the trickier gourmets to fruit.' },
  { name: 'Reishi', latin: 'Ganoderma lingzhi', type: 'Medicinal', difficulty: 'Intermediate', colonizeC: [25, 30], fruitC: [24, 29], humidity: '90–95%', co2: 'High → antlers / Low → conks', fae: 'Varies by form', light: 'Needed for conks', timeToFruit: '14–21 days', be: '~30–50%', note: 'Steer the form with CO2: high CO2 + low light gives antlers; low CO2 + light gives flat conks. Grown for medicine, not weight.' },
  { name: 'Turkey Tail', latin: 'Trametes versicolor', type: 'Medicinal', difficulty: 'Beginner', colonizeC: [24, 27], fruitC: [18, 24], humidity: '85–95%', co2: '<1000 ppm', fae: 'High', light: 'Needed', timeToFruit: '14–30 days', be: 'medicinal — not weight-based', note: 'Vigorous and tolerant; grown for extracts. Light plus fresh air gives good banded rosettes.' },
];
