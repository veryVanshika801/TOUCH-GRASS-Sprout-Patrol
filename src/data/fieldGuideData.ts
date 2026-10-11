import type { FieldGuideItem, AccessoryId, BingoCell, WeeklyBingoState } from '../types';

export const WARDROBE_ACCESSORIES: {
  id: AccessoryId;
  name: string;
  unlockXp: number;
  description: string;
}[] = [
  {
    id: 'none',
    name: 'Natural Look',
    unlockXp: 0,
    description: 'Just your companion’s pure woodland self.',
  },
  {
    id: 'acorn_cap',
    name: 'Woodland Acorn Beret',
    unlockXp: 50,
    description: 'A jaunty oak-cap beret for seasoned trail scouts.',
  },
  {
    id: 'flower_crown',
    name: 'Meadow Daisy Crown',
    unlockXp: 150,
    description: 'Woven wild daisies and golden buttercups.',
  },
  {
    id: 'cozy_scarf',
    name: 'Moss-Knit Trail Scarf',
    unlockXp: 250,
    description: 'Snug crimson-and-gold knit scarf for breezy walks.',
  },
  {
    id: 'binoculars',
    name: 'Tiny Birding Binoculars',
    unlockXp: 400,
    description: 'Precision brass field glasses for Master Naturalists.',
  },
];

// 16 Collectible Field Guide Entries across Leaves, Birds, Flowers, and Bugs (including 4 Legendary Finds!)
export const FIELD_GUIDE_CATALOG: FieldGuideItem[] = [
  // LEAVES
  {
    id: 'fg_leaf_maple',
    name: 'Scarlet Sugar Maple',
    category: 'leaves',
    rarity: 'Common',
    scientificName: 'Acer saccharum',
    funFact: 'Produces brilliant crimson and tangerine shades as chlorophyll breaks down in crisp autumn air.',
    svgVariant: 'maple',
  },
  {
    id: 'fg_leaf_oak',
    name: 'White Oak Lobed Leaf',
    category: 'leaves',
    rarity: 'Common',
    scientificName: 'Quercus alba',
    funFact: 'Rounded finger-like lobes feed over 500 species of caterpillars and songbirds.',
    svgVariant: 'oak',
  },
  {
    id: 'fg_leaf_fern',
    name: 'Sword Fern Frond',
    category: 'leaves',
    rarity: 'Uncommon',
    scientificName: 'Polystichum munitum',
    funFact: 'Unfurls from tightly coiled "fiddleheads" on shady forest floors.',
    svgVariant: 'fern',
  },
  {
    id: 'fg_leaf_ginkgo',
    name: 'Golden Maidenhair Ginkgo',
    category: 'leaves',
    rarity: 'Legendary',
    scientificName: 'Ginkgo biloba',
    funFact: 'A living fossil unchanged for 200 million years—drops all its golden fan leaves in a single day!',
    svgVariant: 'ginkgo',
  },

  // BIRDS
  {
    id: 'fg_bird_robin',
    name: 'American Song Robin',
    category: 'birds',
    rarity: 'Common',
    scientificName: 'Turdus migratorius',
    funFact: 'Tilts its head on lawns to see—not just hear—earthworms moving underground.',
    svgVariant: 'robin',
  },
  {
    id: 'fg_bird_chickadee',
    name: 'Black-Capped Chickadee',
    category: 'birds',
    rarity: 'Common',
    scientificName: 'Poecile atricapillus',
    funFact: 'Hides thousands of seeds in tree bark every autumn and remembers every single hiding spot!',
    svgVariant: 'chickadee',
  },
  {
    id: 'fg_bird_jay',
    name: 'Crested Stellar Jay',
    category: 'birds',
    rarity: 'Uncommon',
    scientificName: 'Cyanocitta cristata',
    funFact: 'Blue feathers contain zero blue pigment—they scatter light structurally like a prism.',
    svgVariant: 'jay',
  },
  {
    id: 'fg_bird_owl',
    name: 'Golden Barred Owl',
    category: 'birds',
    rarity: 'Legendary',
    scientificName: 'Strix varia',
    funFact: 'Serrated wing feathers muffle air turbulence, making its twilight flight virtually silent.',
    svgVariant: 'owl',
  },

  // FLOWERS
  {
    id: 'fg_flower_clover',
    name: 'Crimson Honey Clover',
    category: 'flowers',
    rarity: 'Common',
    scientificName: 'Trifolium pratense',
    funFact: 'Fixes nitrogen from the air straight into the soil while feeding bumblebees.',
    svgVariant: 'clover',
  },
  {
    id: 'fg_flower_dandelion',
    name: 'Sunbeam Dandelion Puff',
    category: 'flowers',
    rarity: 'Common',
    scientificName: 'Taraxacum officinale',
    funFact: 'Each parachute seed can ride updrafts for miles before landing in a new meadow.',
    svgVariant: 'dandelion',
  },
  {
    id: 'fg_flower_coneflower',
    name: 'Purple Echinacea Cone',
    category: 'flowers',
    rarity: 'Uncommon',
    scientificName: 'Echinacea purpurea',
    funFact: 'Its central seed cone spirals follow the mathematical Fibonacci sequence.',
    svgVariant: 'coneflower',
  },
  {
    id: 'fg_flower_ghostpipe',
    name: 'Luminous Ghost Pipe Orchid',
    category: 'flowers',
    rarity: 'Legendary',
    scientificName: 'Monotropa uniflora',
    funFact: 'Contains zero chlorophyll—this translucent porcelain plant partners with forest mushroom networks!',
    svgVariant: 'ghostpipe',
  },

  // BUGS
  {
    id: 'fg_bug_ladybug',
    name: 'Seven-Spot Lady Beetle',
    category: 'bugs',
    rarity: 'Common',
    scientificName: 'Coccinella septempunctata',
    funFact: 'A beloved garden guardian that naps in cozy clusters under bark during winter.',
    svgVariant: 'ladybug',
  },
  {
    id: 'fg_bug_bumble',
    name: 'Fuzzy Golden Bumblebee',
    category: 'bugs',
    rarity: 'Common',
    scientificName: 'Bombus impatiens',
    funFact: 'Vibrates its flight muscles at middle-C ("buzz pollination") to shake pollen loose from flowers.',
    svgVariant: 'bumble',
  },
  {
    id: 'fg_bug_dragonfly',
    name: 'Emerald Darner Dragonfly',
    category: 'bugs',
    rarity: 'Uncommon',
    scientificName: 'Anax junius',
    funFact: 'Four independent wings let it hover, fly backward, and pivot in mid-air at 30 mph.',
    svgVariant: 'dragonfly',
  },
  {
    id: 'fg_bug_luna',
    name: 'Moonlit Luna Moth',
    category: 'bugs',
    rarity: 'Legendary',
    scientificName: 'Actias luna',
    funFact: 'Long twisting emerald hindwing tails confuse bat echolocation in the night canopy.',
    svgVariant: 'luna',
  },
];

// Roll a Field Guide discovery upon check-in (~22% chance of a Legendary Find!)
export function rollFieldGuideDiscovery(alreadyUnlocked: string[]): {
  item: FieldGuideItem;
  isNew: boolean;
  isLegendary: boolean;
} {
  const isLegendaryRoll = Math.random() < 0.24;
  const legendaryPool = FIELD_GUIDE_CATALOG.filter((i) => i.rarity === 'Legendary');
  const standardPool = FIELD_GUIDE_CATALOG.filter((i) => i.rarity !== 'Legendary');

  const targetPool = isLegendaryRoll ? legendaryPool : standardPool;
  const lockedInPool = targetPool.filter((i) => !alreadyUnlocked.includes(i.id));
  const finalPool = lockedInPool.length > 0 ? lockedInPool : targetPool;

  const chosen = finalPool[Math.floor(Math.random() * finalPool.length)] || FIELD_GUIDE_CATALOG[0];
  return {
    item: chosen,
    isNew: !alreadyUnlocked.includes(chosen.id),
    isLegendary: chosen.rarity === 'Legendary',
  };
}

// Weekly 3x3 Outdoor Scavenger Bingo Card
export const DEFAULT_BINGO_PROMPTS: { id: string; label: string; hint: string }[] = [
  { id: 'b1', label: 'Something Crimson or Gold', hint: 'A bright leaf, berry, or petal' },
  { id: 'b2', label: 'A Bird Call Overhead', hint: 'Listen for a chirp or caw' },
  { id: 'b3', label: 'A Natural Spiral Shape', hint: 'Pinecone, snail shell, or flower center' },
  { id: 'b4', label: 'Moss on Bark or Stone', hint: 'Check shady north-facing surfaces' },
  { id: 'b5', label: 'Deep Breath of Fresh Air', hint: 'Free center square when you step out!' },
  { id: 'b6', label: 'A Pollinator or Bug', hint: 'Bee, beetle, butterfly, or ant' },
  { id: 'b7', label: 'Sunlight Through Leaves', hint: 'Dappled shadows on the ground' },
  { id: 'b8', label: 'Rough vs Smooth Bark', hint: 'Touch two different tree trunks' },
  { id: 'b9', label: 'An Interesting Cloud', hint: 'Look up at the sky dome for 30s' },
];

export function createInitialWeeklyBingo(): WeeklyBingoState {
  const now = new Date();
  const weekStartIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const cells: BingoCell[] = DEFAULT_BINGO_PROMPTS.map((p, idx) => ({
    id: p.id,
    label: p.label,
    hint: p.hint,
    completed: idx === 4, // Free center square
    completedAt: idx === 4 ? new Date().toISOString() : undefined,
  }));
  return {
    weekStartIso,
    cells,
    claimedLines: 0,
    fullHouseClaimed: false,
  };
}

export function countBingoLines(cells: BingoCell[]): number {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return lines.filter((line) => line.every((idx) => cells[idx]?.completed)).length;
}
