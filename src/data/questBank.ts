import type { CompanionId, OutdoorInterest, Quest } from '../types';

export interface CompanionProfile {
  id: CompanionId;
  name: string;
  species: string;
  tagline: string;
  personality: string;
  accentColor: string;
  bgTint: string;
  sleepyLines: string[];
  happyLines: string[];
  excitedLines: string[];
  grumpyLines: string[];
  phoneDownPrompts: string[];
  reactionTemplates: string[];
}

export const COMPANION_PROFILES: Record<CompanionId, CompanionProfile> = {
  moss: {
    id: 'moss',
    name: 'Moss',
    species: 'Sarcastic Forest Mushroom',
    tagline: 'Roasts your screen time with Tough Spore Love.',
    personality: 'Grumpy-but-lovable toadstool who dries out indoors and begs you to go touch real dirt.',
    accentColor: '#D97706',
    bgTint: '#FEF3C7',
    sleepyLines: [
      'My cap is literally shriveling from indoor Wi-Fi waves. Can we go outside for 10 minutes?',
      'Still staring at glowing rectangles, huh? Cool, cool. I’ll just photosynthesize dust.',
      'Not to guilt-trip you, but the moss on the north side of your street misses us.',
    ],
    happyLines: [
      'Look at us! Breathing oxygen that didn’t come from an air vent!',
      'My spores are hydrated and my attitude is only 20% snarky today. Good job.',
      'You actually went outside today. I’m genuinely proud of you, human.',
    ],
    excitedLines: [
      'Hold on—are we ACTUALLY putting the phone away?! Let’s go before you check notifications!',
      'Dirt! Humidity! Decaying leaves! Today is an elite day to be a fungus!',
    ],
    grumpyLines: [
      'Oh look, another thumb-scroll marathon. Truly heroic.',
      'If you don’t open the front door soon, I’m moving into a houseplant.',
    ],
    phoneDownPrompts: [
      'Lock your screen and slip me into your pocket. If you look at your phone, I WILL judge you.',
      'Put the glowing brick away. Count how many shades of green are within 20 feet of you.',
    ],
    reactionTemplates: [
      'Well look who survived without a screen for {minutes} whole minutes! Spotting {sightings} out there actually put a glow back in my mushroom cap.',
      'I hate to admit it, but your {minutes}-minute expedition was top-tier. Those {sightings} you noticed? That’s the real high-resolution feed.',
      'See? The outside graphics engine is unbeatable. {minutes} minutes in the fresh air with {sightings} made my mycelium grow twice as fast!',
    ],
  },
  pip: {
    id: 'pip',
    name: 'Pip',
    species: 'Hyperactive Songbird Chick',
    tagline: 'Obsessed with every chirp, rustle, and breeze.',
    personality: 'Tiny round bird vibrating with enthusiasm who wants to catalog every sound in the sky.',
    accentColor: '#0284C7',
    bgTint: '#E0F2FE',
    sleepyLines: [
      '*Yawn-chirp*... It’s too quiet inside! Where are the wind chimes and robin songs?',
      'My feathers are all fluffed up for a walk whenever you’re ready, friend!',
      'I heard a distant sparrow through the window! Can we go say hi?',
    ],
    happyLines: [
      'CHIRP! My wings are still buzzing from our outdoor patrol today!',
      'Did you hear that breeze earlier? Best soundtrack on Earth!',
      'You’re the best flock leader ever! Let’s listen to the trees again soon!',
    ],
    excitedLines: [
      'FLAP FLAP FLAP! WE ARE GOING OUTSIDE! Ears open, eyes up!',
      'WAIT—is it quest time?! I bet we hear at least three different bird calls!',
    ],
    grumpyLines: [
      'Indoor air has zero acoustics! Not even a single cricket!',
      'Peep... my tiny talons were made for twigs, not desk lamps!',
    ],
    phoneDownPrompts: [
      'Tuck your phone away, close your eyes for ten seconds, and listen for the farthest sound you can hear!',
      'Screen off, ears on! Every rustling leaf has a secret message for us.',
    ],
    reactionTemplates: [
      'CHIRP-HOORAY! {minutes} minutes out in the open air! When you noticed {sightings}, my tail feathers did a triple backflip!',
      'That was the best acoustic concert ever! {minutes} minutes offline and spotting {sightings}—you have true songbird senses!',
      'PEEP PEEP! I wrote a whole melody about {sightings} while we were out for those {minutes} glorious minutes!',
    ],
  },
  fernsworth: {
    id: 'fernsworth',
    name: 'Sir Fernsworth',
    species: 'Chivalrous Frond Knight',
    tagline: 'Treats every neighborhood stroll like an epic ballad.',
    personality: 'Dramatic botanical paladin clad in dewdrop armor who defends you from the Doomscroll Dragon.',
    accentColor: '#15803D',
    bgTint: '#DCFCE7',
    sleepyLines: [
      'Alas, my noble fronds droop within this digital fortress. The realm beyond awaits our stride!',
      'Even the bravest botanical knight requires a sunbeam upon his shield, my liege.',
      'The Couch Kingdom is comfortable, yet glory lies beyond the threshold!',
    ],
    happyLines: [
      'Huzzah! We have vanquished the Indoor Slumber and claimed the sunlit trails!',
      'My chlorophyll shield gleams with honor after today’s noble patrol!',
      'Bards shall sing of how you stepped outside and breathed the wild wind today!',
    ],
    excitedLines: [
      'SOUND THE ACORN HORN! We ride—er, walk briskly—into the Emerald Wilds!',
      'Raise the banner! A grand outdoor quest has been decreed!',
    ],
    grumpyLines: [
      'Fie upon this glowing glass rectangle! It steals valor from our boots!',
      'Shall a knight of the Woodland Order be defeated by indoor inertia?! Never!',
    ],
    phoneDownPrompts: [
      'Sheathe thy glowing device! Walk with your chin high and observe the realm with noble eyes.',
      'A true ranger looks upon the horizon, not the glass scroll. Go forth in peace!',
    ],
    reactionTemplates: [
      'HUZZAH, NOBLE RANGER! For {minutes} valiant minutes you walked the realm and beheld {sightings}! The Woodland Order salutes thee!',
      'By the Ancient Oak! A {minutes}-minute campaign graced by {sightings}—thy courage against the Doomscroll Dragon is legendary!',
      'Let the chronicles record this victory! {minutes} minutes under the open sky with {sightings} hath strengthened my frond armor!',
    ],
  },
  beeatrice: {
    id: 'beeatrice',
    name: 'Bee-atrice',
    species: 'Chill Garden Honeybee',
    tagline: 'Pollinates good vibes and speaks fluent pun.',
    personality: 'Laid-back fuzzy bee wearing tiny shades who believes every problem is solved by smelling a flower.',
    accentColor: '#CA8A04',
    bgTint: '#FEF9C3',
    sleepyLines: [
      'Justzzz resting my wings... wake me up when we’re ready to go buzz around the block.',
      'No rush, honey, but a little sunshine would really bee-righten our afternoon.',
      'My pollen basket is feeling a little empty today—wanna go check out some leaves?',
    ],
    happyLines: [
      'You’re looking totally un-bee-lievable after getting some fresh air today!',
      'Sweet as clover honey! Nothing beats a little time out in the garden.',
      'High-hive! Our outdoor vibe check passed with flying colors.',
    ],
    excitedLines: [
      'BZZZZ! Ready to roll, petal! Let’s go see what’s blooming out there!',
      'Now THAT’S the buzz I like to hear! Sunlight, here we come!',
    ],
    grumpyLines: [
      'Scrolling again? Honey, that feed is a total buzzkill compared to real clouds.',
      'Don’t make me sting your Wi-Fi router! (Just kidding, I’m a lover not a fighter.)',
    ],
    phoneDownPrompts: [
      'Pocket the phone, slow your pace by 20%, and take a deep breath like you’re smelling warm honey.',
      'No screens needed out here, bee-stie. Just follow the breeze and see what catches your eye.',
    ],
    reactionTemplates: [
      'Un-BEE-lievable job out there, honey! {minutes} minutes of pure fresh air and spotting {sightings}—that’s the sweet stuff!',
      'High-hive! Spending {minutes} minutes noticing {sightings} is the ultimate pollen for the soul!',
      'You’re officially the Queen Bee of touching grass! {minutes} cozy minutes outside with {sightings} made my wings hum with joy!',
    ],
  },
};

export interface OfflineQuestTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Epic';
  minutes: number;
  xp: number;
  category: OutdoorInterest;
  seasons: ('Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All')[];
  findName: string;
  findType: 'leaf' | 'bird' | 'flower' | 'stone' | 'cloud' | 'acorn';
}

// 64 Handcrafted, specific, doable real-world outdoor quests across all interests & seasons
export const OFFLINE_QUEST_BANK: OfflineQuestTemplate[] = [
  // FOLIAGE (11 quests)
  {
    id: 'fol-1',
    title: 'The Three-Color Leaf Palette',
    description: 'Step outside and find 3 fallen leaves of noticeably different shades (green, gold, crimson, or bronze) and arrange them side-by-side on a bench, wall, or step.',
    difficulty: 'Easy',
    minutes: 10,
    xp: 50,
    category: 'foliage',
    seasons: ['Autumn', 'Spring', 'Summer', 'All'],
    findName: 'Tri-Tone Autumn Leaf',
    findType: 'leaf',
  },
  {
    id: 'fol-2',
    title: 'Crown Jewel Canopy Hunt',
    description: 'Walk for 15 minutes around your block or park to crown the single most vibrant tree within walking distance. Stand underneath its branches and look straight up.',
    difficulty: 'Medium',
    minutes: 20,
    xp: 90,
    category: 'foliage',
    seasons: ['Autumn', 'Spring', 'All'],
    findName: 'Amber Canopy Crest',
    findType: 'leaf',
  },
  {
    id: 'fol-3',
    title: 'Bark Texture Detective',
    description: 'Find two completely different trees—one with rough, deeply ridged bark and one with smooth or peeling bark. Gently touch both and notice the temperature difference.',
    difficulty: 'Easy',
    minutes: 12,
    xp: 55,
    category: 'foliage',
    seasons: ['All', 'Winter'],
    findName: 'Ancient Cedar Bark Rubbing',
    findType: 'acorn',
  },
  {
    id: 'fol-4',
    title: 'The Crunch Meter Stroll',
    description: 'Seek out a patch of dry fallen leaves, pine needles, or gravel and walk slowly through it, paying full attention to the rhythm of the crunch under your shoes.',
    difficulty: 'Easy',
    minutes: 15,
    xp: 60,
    category: 'foliage',
    seasons: ['Autumn', 'Winter', 'All'],
    findName: 'Crisp Oak Leaf',
    findType: 'leaf',
  },
  {
    id: 'fol-5',
    title: 'Seed Pod & Acorn Scavenger',
    description: 'Spot 3 tree seeds in the wild—acorns, pine cones, winged maple "helicopters", or sweetgum spiky balls. Toss a maple helicopter into the breeze if you find one!',
    difficulty: 'Medium',
    minutes: 20,
    xp: 90,
    category: 'foliage',
    seasons: ['Autumn', 'Winter', 'All'],
    findName: 'Lucky Woodland Acorn',
    findType: 'acorn',
  },
  {
    id: 'fol-6',
    title: 'Sunlit Vein Inspector',
    description: 'Pick up a single interesting leaf and hold it up toward the sky so sunlight shines through its fractal vein network like stained glass.',
    difficulty: 'Easy',
    minutes: 10,
    xp: 50,
    category: 'foliage',
    seasons: ['All'],
    findName: 'Sun-Veined Sycamore Leaf',
    findType: 'leaf',
  },
  {
    id: 'fol-7',
    title: 'The Moss & Lichen Micro-Safari',
    description: 'Lean in close to the north side of a tree trunk, damp brick wall, or shady curb until you find a miniature forest of velvety green moss or silver lichen.',
    difficulty: 'Medium',
    minutes: 20,
    xp: 85,
    category: 'foliage',
    seasons: ['All', 'Winter', 'Spring'],
    findName: 'Velvet Cushion Moss',
    findType: 'leaf',
  },
  {
    id: 'fol-8',
    title: 'Evergreen Perfume Test',
    description: 'Locate a pine, fir, cedar, or rosemary bush. Gently rub a few needles between your fingers and inhale the crisp woodland resin scent.',
    difficulty: 'Easy',
    minutes: 12,
    xp: 55,
    category: 'foliage',
    seasons: ['Winter', 'All'],
    findName: 'Silver Fir Sprig',
    findType: 'leaf',
  },
  {
    id: 'fol-9',
    title: 'Grand Arboretum Expedition',
    description: 'Take a 35-minute walk through the greenest route near you and try to identify 5 distinct leaf shapes (lobed, serrated, needle, heart-shaped, or palmate).',
    difficulty: 'Epic',
    minutes: 35,
    xp: 150,
    category: 'foliage',
    seasons: ['All'],
    findName: 'Golden Ginkgo Fan',
    findType: 'leaf',
  },
  {
    id: 'fol-10',
    title: 'New Bud Lookout',
    description: 'Inspect the tips of low-hanging tree branches or shrubs to spot tiny buds, unfurling shoots, or winter scales waiting for warmer days.',
    difficulty: 'Easy',
    minutes: 12,
    xp: 55,
    category: 'foliage',
    seasons: ['Spring', 'Winter', 'All'],
    findName: 'Emerald Spring Bud',
    findType: 'leaf',
  },
  {
    id: 'fol-11',
    title: 'Shadow Puppet Canopy Walk',
    description: 'Walk down a tree-lined street and watch the moving leaf shadows dancing on the pavement or walls without looking at your phone once.',
    difficulty: 'Medium',
    minutes: 25,
    xp: 100,
    category: 'foliage',
    seasons: ['Summer', 'Autumn', 'Spring', 'All'],
    findName: 'Dappled Sunbeam Leaf',
    findType: 'leaf',
  },

  // BIRDING (11 quests)
  {
    id: 'bird-1',
    title: 'Five-Minute Sound Map',
    description: 'Stand or sit completely still outside for 5 minutes. Close your eyes and count how many distinct bird calls or wing flutters you can hear in every direction.',
    difficulty: 'Easy',
    minutes: 10,
    xp: 55,
    category: 'birding',
    seasons: ['All'],
    findName: 'Songbird Melody Feather',
    findType: 'bird',
  },
  {
    id: 'bird-2',
    title: 'Wire & Rooftop Lookout',
    description: 'Walk two blocks while scanning high perches—utility wires, streetlights, chimneys, and treetops. Spot at least 3 perched birds and observe which way they face into the wind.',
    difficulty: 'Easy',
    minutes: 15,
    xp: 65,
    category: 'birding',
    seasons: ['All'],
    findName: 'Skyline Sparrow Badge',
    findType: 'bird',
  },
  {
    id: 'bird-3',
    title: 'Forager Footwork Observation',
    description: 'Find a bird on the ground (robin, sparrow, crow, mourning dove, or pigeon) and watch it for 3 full minutes. Does it hop with both feet or walk one step at a time?',
    difficulty: 'Medium',
    minutes: 20,
    xp: 90,
    category: 'birding',
    seasons: ['All'],
    findName: 'Hopping Robin Plume',
    findType: 'bird',
  },
  {
    id: 'bird-4',
    title: 'Corvid Intelligence Patrol',
    description: 'Keep an ear out for the bold caw of a crow, raven, jay, or magpie. Watch what they are investigating or carrying in their beak.',
    difficulty: 'Medium',
    minutes: 25,
    xp: 95,
    category: 'birding',
    seasons: ['Autumn', 'Winter', 'All'],
    findName: 'Obsidian Crow Feather',
    findType: 'bird',
  },
  {
    id: 'bird-5',
    title: 'Thermal Glider Skywatch',
    description: 'Find an open patch of sky and watch for 10 minutes until you spot a bird gliding on wind currents without flapping its wings (hawk, gull, heron, or swift).',
    difficulty: 'Medium',
    minutes: 20,
    xp: 90,
    category: 'birding',
    seasons: ['All'],
    findName: 'Red-Tailed Thermal Wing',
    findType: 'bird',
  },
  {
    id: 'bird-6',
    title: 'Shrub & Hedgerow Rustle',
    description: 'Walk slowly past dense bushes or hedges and listen for the tiny "chip" notes of small songbirds hiding inside the branches.',
    difficulty: 'Easy',
    minutes: 15,
    xp: 60,
    category: 'birding',
    seasons: ['All'],
    findName: 'Chickadee Hedge Stamp',
    findType: 'bird',
  },
  {
    id: 'bird-7',
    title: 'Waterfront or Puddle Flock Check',
    description: 'Head to the nearest pond, creek, fountain, or rain puddle to see if any ducks, geese, or bathing songbirds have gathered for a drink.',
    difficulty: 'Epic',
    minutes: 35,
    xp: 150,
    category: 'birding',
    seasons: ['All'],
    findName: 'Mallard Speculum Feather',
    findType: 'bird',
  },
  {
    id: 'bird-8',
    title: 'Nest Architecture Survey',
    description: 'Look up into the forks of tree branches (especially easy when leaves thin out) until you spot a tucked-away bird nest or squirrel drey.',
    difficulty: 'Medium',
    minutes: 20,
    xp: 85,
    category: 'birding',
    seasons: ['Autumn', 'Winter', 'Spring', 'All'],
    findName: 'Woven Twig Nest Emblem',
    findType: 'bird',
  },
  {
    id: 'bird-9',
    title: 'Dawn or Dusk Chorus Listening',
    description: 'Step outside during the transition of morning or early evening and listen to the neighborhood birds claiming their territories in song.',
    difficulty: 'Easy',
    minutes: 15,
    xp: 65,
    category: 'birding',
    seasons: ['Spring', 'Summer', 'All'],
    findName: 'Golden Warbler Note',
    findType: 'bird',
  },
  {
    id: 'bird-10',
    title: 'The Great Feather & Flight Safari',
    description: 'Take a 40-minute walk with zero headphones. Count every single bird you see or hear and try to spot at least 4 different species sizes.',
    difficulty: 'Epic',
    minutes: 40,
    xp: 160,
    category: 'birding',
    seasons: ['All'],
    findName: 'Blue Jay Crest Plume',
    findType: 'bird',
  },
  {
    id: 'bird-11',
    title: 'Woodpecker & Tree Climber Search',
    description: 'Listen for rhythmic tapping on telephone poles or tree trunks, or watch for a bird creeping vertically up tree bark.',
    difficulty: 'Medium',
    minutes: 25,
    xp: 100,
    category: 'birding',
    seasons: ['All'],
    findName: 'Downy Woodpecker Badge',
    findType: 'bird',
  },

  // HIKING & EXPLORATION (11 quests)
  {
    id: 'hike-1',
    title: 'The Coin-Flip Crossroads Walk',
    description: 'Head out your door and at the first 4 intersections, turn whichever direction looks greener or less familiar. Take a mini detour you rarely walk.',
    difficulty: 'Medium',
    minutes: 20,
    xp: 90,
    category: 'hiking',
    seasons: ['All'],
    findName: 'Wayfinder Cairn Stone',
    findType: 'stone',
  },
  {
    id: 'hike-2',
    title: 'Elevation & Horizon Seek',
    description: 'Walk to the highest natural point, hill, bridge, or open clearing within 15 minutes of you and gaze at the farthest horizon line for 2 full minutes.',
    difficulty: 'Medium',
    minutes: 25,
    xp: 100,
    category: 'hiking',
    seasons: ['All'],
    findName: 'Summit Ridge Pebble',
    findType: 'stone',
  },
  {
    id: 'hike-3',
    title: 'Unpaved Footpath Quest',
    description: 'Find a stretch of earth that isn’t concrete or asphalt—a dirt path, grassy verge, gravel trail, or park lawn—and walk at least 300 steps on natural ground.',
    difficulty: 'Easy',
    minutes: 15,
    xp: 60,
    category: 'hiking',
    seasons: ['All'],
    findName: 'Trailblazer Quartz Stone',
    findType: 'stone',
  },
  {
    id: 'hike-4',
    title: 'Pocket Geological Survey',
    description: 'Spot 3 cool rocks or stones along your walk—look for quartz veins, smooth river pebbles, mica sparkles, or interesting erosion shapes.',
    difficulty: 'Easy',
    minutes: 12,
    xp: 55,
    category: 'hiking',
    seasons: ['All'],
    findName: 'Speckled Granite Pebble',
    findType: 'stone',
  },
  {
    id: 'hike-5',
    title: 'The 40-Minute Green Corridor Trek',
    description: 'Link together two parks, green spaces, or tree-lined avenues into one continuous 40-minute outdoor hike without checking your phone.',
    difficulty: 'Epic',
    minutes: 40,
    xp: 160,
    category: 'hiking',
    seasons: ['All'],
    findName: 'Emerald Compass Stone',
    findType: 'stone',
  },
  {
    id: 'hike-6',
    title: 'Follow the Water Line',
    description: 'Walk alongside a creek, river, drainage swale, lakeshore, or coastline near you and observe how plants cluster near the water.',
    difficulty: 'Epic',
    minutes: 35,
    xp: 150,
    category: 'hiking',
    seasons: ['All'],
    findName: 'Smooth River Skipping Stone',
    findType: 'stone',
  },
  {
    id: 'hike-7',
    title: 'Cloud Shape Cartographer',
    description: 'Find a park bench or grassy patch, look up at the sky for 5 minutes, and watch how fast the clouds drift and morph across the canopy.',
    difficulty: 'Easy',
    minutes: 12,
    xp: 55,
    category: 'hiking',
    seasons: ['All'],
    findName: 'Cumulus Daydream Stamp',
    findType: 'cloud',
  },
  {
    id: 'hike-8',
    title: 'Five-Senses Trail Reset',
    description: 'During a 15-minute walk, identify 5 textures you see, 4 outdoor sounds, 3 things you can touch (bark, stone, grass), 2 scents in the air, and 1 deep breath.',
    difficulty: 'Easy',
    minutes: 15,
    xp: 65,
    category: 'hiking',
    seasons: ['All'],
    findName: 'Mindful Trail Cairn',
    findType: 'stone',
  },
  {
    id: 'hike-9',
    title: 'Oldest Tree in the Neighborhood',
    description: 'Go on a scouting walk to find the widest, oldest-looking tree trunk within a 10-minute radius of where you are right now.',
    difficulty: 'Medium',
    minutes: 20,
    xp: 90,
    category: 'hiking',
    seasons: ['All'],
    findName: 'Heartwood Heritage Acorn',
    findType: 'acorn',
  },
  {
    id: 'hike-10',
    title: 'Wind Direction Navigator',
    description: 'Step into an open spot, feel the breeze on your face, and watch treetops or flags to figure out which cardinal direction the wind is blowing from today.',
    difficulty: 'Easy',
    minutes: 10,
    xp: 50,
    category: 'hiking',
    seasons: ['All'],
    findName: 'Zephyr Breeze Cloud',
    findType: 'cloud',
  },
  {
    id: 'hike-11',
    title: 'Boundary Explorer Loop',
    description: 'Walk a wide perimeter loop around a neighborhood block or park trail you haven’t visited this month, noticing 3 architectural or natural details.',
    difficulty: 'Medium',
    minutes: 25,
    xp: 95,
    category: 'hiking',
    seasons: ['All'],
    findName: 'Borderland Flint Stone',
    findType: 'stone',
  },

  // GARDENING & BOTANY (11 quests)
  {
    id: 'gard-1',
    title: 'Hydration Hero Patrol',
    description: 'Step outside with a watering can or cup of water and water an outdoor plant, porch pot, street tree base, or garden bed. Check the soil moisture with your finger.',
    difficulty: 'Easy',
    minutes: 10,
    xp: 55,
    category: 'gardening',
    seasons: ['All'],
    findName: 'Dewdrop Marigold Blossom',
    findType: 'flower',
  },
  {
    id: 'gard-2',
    title: 'Pollinator Pitstop Watch',
    description: 'Find a blooming flower, clover patch, or flowering shrub and watch it closely for 5 minutes to see if any bees, hoverflies, butterflies, or beetles visit.',
    difficulty: 'Easy',
    minutes: 15,
    xp: 65,
    category: 'gardening',
    seasons: ['Spring', 'Summer', 'Autumn', 'All'],
    findName: 'Honeycomb Clover Stamp',
    findType: 'flower',
  },
  {
    id: 'gard-3',
    title: 'Neighborhood Front-Yard Botanist',
    description: 'Stroll down a residential street or community garden and admire 5 different front-yard gardens, window boxes, or resilient sidewalk wildflowers.',
    difficulty: 'Medium',
    minutes: 20,
    xp: 90,
    category: 'gardening',
    seasons: ['All'],
    findName: 'Cottage Lavender Sprig',
    findType: 'flower',
  },
  {
    id: 'gard-4',
    title: 'Sidewalk Crack Survivor',
    description: 'Find the bravest little dandelion, fern, clover, or wildflower growing out of a tiny crack in a wall or pavement and cheer it on.',
    difficulty: 'Easy',
    minutes: 10,
    xp: 50,
    category: 'gardening',
    seasons: ['All'],
    findName: 'Resilient Dandelion Crown',
    findType: 'flower',
  },
  {
    id: 'gard-5',
    title: 'Garden Tidy & Mulch Care',
    description: 'Spend 20 minutes outside tending a garden bed, pulling invasive weeds, sweeping fallen leaves onto soil as natural mulch, or pruning dead stems.',
    difficulty: 'Medium',
    minutes: 20,
    xp: 95,
    category: 'gardening',
    seasons: ['All'],
    findName: 'Heirloom Sunflower Petal',
    findType: 'flower',
  },
  {
    id: 'gard-6',
    title: 'Seed & Bulb Pocket Mission',
    description: 'Check dried flower heads in a garden or park edge for ripe seeds, or plan and clear a sunny spot where native wildflowers could grow.',
    difficulty: 'Medium',
    minutes: 25,
    xp: 95,
    category: 'gardening',
    seasons: ['Autumn', 'Spring', 'All'],
    findName: 'Wild Poppy Seed Pod',
    findType: 'acorn',
  },
  {
    id: 'gard-7',
    title: 'Aromatic Herb & Leaf Sniff',
    description: 'Find an aromatic plant outdoors—lavender, mint, rosemary, sage, pine, or crushed sweetgum leaves—and take three slow breaths of its natural essential oils.',
    difficulty: 'Easy',
    minutes: 12,
    xp: 55,
    category: 'gardening',
    seasons: ['All'],
    findName: 'Wild Rosemary Blossom',
    findType: 'flower',
  },
  {
    id: 'gard-8',
    title: 'Soil & Compost Recon',
    description: 'Turn over a small stone, log edge, or garden clump outside to spot the hardworking decomposers (earthworms, pillbugs, or rich dark humus) keeping the soil alive.',
    difficulty: 'Medium',
    minutes: 20,
    xp: 85,
    category: 'gardening',
    seasons: ['All'],
    findName: 'Rich Earth Clover',
    findType: 'flower',
  },
  {
    id: 'gard-9',
    title: 'The Botanical Sanctuary Tour',
    description: 'Take a 35-minute excursion to a community garden, botanical park, or nursery and find 3 plants you have never noticed before.',
    difficulty: 'Epic',
    minutes: 35,
    xp: 150,
    category: 'gardening',
    seasons: ['All'],
    findName: 'Botanical Camellia Stamp',
    findType: 'flower',
  },
  {
    id: 'gard-10',
    title: 'Tree Steward Litter Sweep',
    description: 'Pick one tree pit or green patch on your street and remove 3 pieces of litter so its roots and moss have a clean home (wash hands when back!).',
    difficulty: 'Easy',
    minutes: 15,
    xp: 70,
    category: 'gardening',
    seasons: ['All'],
    findName: 'Guardian Daisy Badge',
    findType: 'flower',
  },
  {
    id: 'gard-11',
    title: 'Petal Geometry Study',
    description: 'Find any outdoor flower or pinecone and count the spirals or petals to spot nature’s Fibonacci numbers in action.',
    difficulty: 'Easy',
    minutes: 12,
    xp: 55,
    category: 'gardening',
    seasons: ['All'],
    findName: 'Golden Spiral Coneflower',
    findType: 'flower',
  },

  // RUNNING & MOVEMENT (10 quests)
  {
    id: 'run-1',
    title: '12-Minute Easy Breeze Jog',
    description: 'Head out for an easy, conversational-pace 12-minute jog or brisk power-walk where your only goal is feeling the air move past your ears.',
    difficulty: 'Easy',
    minutes: 12,
    xp: 60,
    category: 'running',
    seasons: ['All'],
    findName: 'Tailwind Zephyr Cloud',
    findType: 'cloud',
  },
  {
    id: 'run-2',
    title: 'Park Bench Stretch & Stride',
    description: 'Jog or walk briskly to the nearest park bench or curb, do 3 minutes of calf, hamstring, and shoulder stretches under the open sky, and stride back.',
    difficulty: 'Easy',
    minutes: 15,
    xp: 65,
    category: 'running',
    seasons: ['All'],
    findName: 'Sunlit Stride Leaf',
    findType: 'leaf',
  },
  {
    id: 'run-3',
    title: 'Fartlek Tree-to-Tree Dash',
    description: 'Play with speed like a kid: pick a landmark tree or lamppost ahead, jog or stride briskly to it, then walk slowly for two trees to recover. Repeat 4 times!',
    difficulty: 'Medium',
    minutes: 20,
    xp: 95,
    category: 'running',
    seasons: ['All'],
    findName: 'Swift Falcon Feather',
    findType: 'bird',
  },
  {
    id: 'run-4',
    title: 'No-Watch Tempo Loop',
    description: 'Run or briskly walk a 25-minute loop guided purely by how your breathing and footsteps feel—no staring at pace metrics or screens.',
    difficulty: 'Medium',
    minutes: 25,
    xp: 100,
    category: 'running',
    seasons: ['All'],
    findName: 'Rhythm Runner Stone',
    findType: 'stone',
  },
  {
    id: 'run-5',
    title: 'Hill Crest Challenge',
    description: 'Find a gentle hill, ramp, or flight of outdoor steps nearby. Power up to the top twice and enjoy the view and deep breaths at the crest.',
    difficulty: 'Medium',
    minutes: 20,
    xp: 95,
    category: 'running',
    seasons: ['All'],
    findName: 'Ridge Runner Acorn',
    findType: 'acorn',
  },
  {
    id: 'run-6',
    title: 'The 35-Minute Trail Endurance Cruise',
    description: 'Lace up for a steady 35-minute outdoor run or brisk hike-jog mix, greeting at least two fellow walkers, runners, or dogs along the way.',
    difficulty: 'Epic',
    minutes: 35,
    xp: 155,
    category: 'running',
    seasons: ['All'],
    findName: 'Marathon Maple Crest',
    findType: 'leaf',
  },
  {
    id: 'run-7',
    title: 'Sunrise or Sunset Shakeout',
    description: 'Step out for a 15-minute movement shakeout right as the sky is changing color, letting natural light reset your circadian rhythm.',
    difficulty: 'Easy',
    minutes: 15,
    xp: 65,
    category: 'running',
    seasons: ['All'],
    findName: 'Horizon Glow Cloud',
    findType: 'cloud',
  },
  {
    id: 'run-8',
    title: 'Soft Surface Footwork Run',
    description: 'Seek out grass, dirt, or cinder paths for at least half of a 20-minute run or brisk walk to give your joints a soft, natural landing.',
    difficulty: 'Medium',
    minutes: 20,
    xp: 90,
    category: 'running',
    seasons: ['All'],
    findName: 'Meadow Stride Clover',
    findType: 'flower',
  },
  {
    id: 'run-9',
    title: 'Post-Screen Posture Reset Walk',
    description: 'Walk briskly for 12 minutes while rolling your shoulders back and looking at treetop level to undo hours of desk or phone hunching.',
    difficulty: 'Easy',
    minutes: 12,
    xp: 55,
    category: 'running',
    seasons: ['All'],
    findName: 'Tall Pine Needles',
    findType: 'leaf',
  },
  {
    id: 'run-10',
    title: 'Explorer’s 5K Equivalent Adventure',
    description: 'Head out for a 40-minute continuous run or brisk walk exploring the farthest park edge you can reach and return from in time.',
    difficulty: 'Epic',
    minutes: 40,
    xp: 165,
    category: 'running',
    seasons: ['All'],
    findName: 'Voyager Wind Badge',
    findType: 'cloud',
  },

  // STARGAZING & SKY / TWILIGHT (10 quests)
  {
    id: 'star-1',
    title: 'Horizon Gradient Watch',
    description: 'Step outside with an unobstructed view of the sky and spend 10 minutes noticing the subtle gradient from the horizon straight up to the zenith.',
    difficulty: 'Easy',
    minutes: 10,
    xp: 55,
    category: 'stargazing',
    seasons: ['All'],
    findName: 'Twilight Indigo Cloud',
    findType: 'cloud',
  },
  {
    id: 'star-2',
    title: 'Moon Phase & Sky Compass',
    description: 'Head outdoors and search the sky (day or night!) for the Moon or the brightest sky marker. Note its phase or position relative to the trees.',
    difficulty: 'Easy',
    minutes: 15,
    xp: 65,
    category: 'stargazing',
    seasons: ['All'],
    findName: 'Silver Crescent Stone',
    findType: 'stone',
  },
  {
    id: 'star-3',
    title: 'First Three Stars / High Clouds Patrol',
    description: 'Stand in the darkest or calmest outdoor spot near your home for 15 minutes, letting your eyes adjust to the natural distance of the sky dome.',
    difficulty: 'Medium',
    minutes: 20,
    xp: 90,
    category: 'stargazing',
    seasons: ['All'],
    findName: 'Starlight Quartz Pebble',
    findType: 'stone',
  },
  {
    id: 'star-4',
    title: 'Tree Silhouette Framing',
    description: 'Find a spot where tree branches frame the open sky like ink brushstrokes. Watch the sky through the branches for 10 quiet minutes.',
    difficulty: 'Easy',
    minutes: 12,
    xp: 55,
    category: 'stargazing',
    seasons: ['All'],
    findName: 'Canopy Silhouette Leaf',
    findType: 'leaf',
  },
  {
    id: 'star-5',
    title: 'Constellation & Planet Scout',
    description: 'Take a 25-minute evening or early morning walk and locate the Big Dipper, Orion, Cassiopeia, or a steady non-twinkling planet on the ecliptic.',
    difficulty: 'Medium',
    minutes: 25,
    xp: 100,
    category: 'stargazing',
    seasons: ['All'],
    findName: 'Celestial Compass Badge',
    findType: 'cloud',
  },
  {
    id: 'star-6',
    title: 'Cloud Altitude Layer Study',
    description: 'Look up and try to spot two different cloud layers or wind speeds high above you—whispy cirrus streams vs puffy lower clouds.',
    difficulty: 'Easy',
    minutes: 15,
    xp: 60,
    category: 'stargazing',
    seasons: ['All'],
    findName: 'High Cirrus Feather Cloud',
    findType: 'cloud',
  },
  {
    id: 'star-7',
    title: 'Night Air & Cricket Symphony',
    description: 'Step outside into the cool air for 20 minutes without looking at any artificial screen light. Listen to the evening breeze, crickets, or distant owls.',
    difficulty: 'Medium',
    minutes: 20,
    xp: 90,
    category: 'stargazing',
    seasons: ['All'],
    findName: 'Nocturne Owl Plume',
    findType: 'bird',
  },
  {
    id: 'star-8',
    title: 'Golden Hour Shadow Stretch',
    description: 'Go outside when the sun is low and measure how long your shadow stretches across the grass or pavement.',
    difficulty: 'Easy',
    minutes: 15,
    xp: 60,
    category: 'stargazing',
    seasons: ['All'],
    findName: 'Sundial Amber Stone',
    findType: 'stone',
  },
  {
    id: 'star-9',
    title: 'Deep Sky Sanctuary Stroll',
    description: 'Take a 35-minute walk away from bright streetlamps into a safe open park or quiet path to experience wide-angle natural sky vision.',
    difficulty: 'Epic',
    minutes: 35,
    xp: 150,
    category: 'stargazing',
    seasons: ['All'],
    findName: 'Nebula Drift Cloud',
    findType: 'cloud',
  },
  {
    id: 'star-10',
    title: 'Zenith Neck-Stretch Break',
    description: 'Walk to an open patch of grass, tilt your head straight up toward the zenith for 60 seconds, and let your eyes focus on infinity instead of 12 inches away.',
    difficulty: 'Easy',
    minutes: 10,
    xp: 50,
    category: 'stargazing',
    seasons: ['All'],
    findName: 'Infinity Sky Stamp',
    findType: 'cloud',
  },
];

export function getOfflineQuests(
  companionId: CompanionId,
  interests: OutdoorInterest[],
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter'
): Quest[] {
  const profile = COMPANION_PROFILES[companionId] || COMPANION_PROFILES.moss;

  // Filter quests matching interests or seasonal relevance
  const matching = OFFLINE_QUEST_BANK.filter(
    (q) =>
      interests.includes(q.category) ||
      q.seasons.includes(season)
  );

  const pool = matching.length >= 6 ? matching : OFFLINE_QUEST_BANK;

  const easyPool = pool.filter((q) => q.difficulty === 'Easy');
  const medPool = pool.filter((q) => q.difficulty === 'Medium');
  const epicPool = pool.filter((q) => q.difficulty === 'Epic');

  const pickRandom = <T,>(arr: T[], fallback: T): T =>
    arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : fallback;

  const qEasy = pickRandom(easyPool, OFFLINE_QUEST_BANK[0]);
  const qMed = pickRandom(medPool, OFFLINE_QUEST_BANK[1]);
  const qEpic = pickRandom(epicPool, OFFLINE_QUEST_BANK[8]);

  const intros: Record<CompanionId, [string, string, string]> = {
    moss: [
      'Even a screen-addicted human can handle this quick 10-minute breather. Let’s go.',
      'My spores are tingling—this mid-length patrol has prime grass-touching potential.',
      'Ready to prove you aren’t fused to your chair? This epic trek will make us legends.',
    ],
    pip: [
      'CHIRP! A quick flutter outside! I bet we hear something awesome right away!',
      'Ooh, a proper scouting flight! Keep your ears tuned for rustling leaves!',
      'EPIC FLOCK EXPEDITION! My wings are vibrating just thinking about all the nature out there!',
    ],
    fernsworth: [
      'A swift reconnaissance patrol beyond the castle gates to refresh thy spirit!',
      'A worthy quest of medium valor! Let us march forth beneath the canopy!',
      'Hark! An epic crusade into the wilds that shall be sung of for generations!',
    ],
    beeatrice: [
      'Short, sweet, and totally bee-ginner friendly! Let’s buzz out for a quick reset.',
      'A golden medium-length stroll—plenty of time to stop and smell the flowers!',
      'The ultimate honey-pot adventure! Let’s stretch our wings and soak in the big outdoors.',
    ],
  };

  const chosenIntros = intros[profile.id] || intros.moss;

  return [
    {
      ...qEasy,
      id: `${qEasy.id}-${Date.now()}-1`,
      companionIntro: chosenIntros[0],
    },
    {
      ...qMed,
      id: `${qMed.id}-${Date.now()}-2`,
      companionIntro: chosenIntros[1],
    },
    {
      ...qEpic,
      id: `${qEpic.id}-${Date.now()}-3`,
      companionIntro: chosenIntros[2],
    },
  ];
}

export function getOfflineReaction(
  companionId: CompanionId,
  minutesSpent: number,
  sightedItems: string[]
): { reaction: string; titleAwarded: string } {
  const profile = COMPANION_PROFILES[companionId] || COMPANION_PROFILES.moss;
  const templates = profile.reactionTemplates;
  const template = templates[Math.floor(Math.random() * templates.length)];

  const sightingsText =
    sightedItems.length > 0
      ? sightedItems.slice(0, 3).join(', ').toLowerCase()
      : 'the fresh breeze and open sky';

  const reaction = template
    .replace('{minutes}', String(Math.max(1, minutesSpent)))
    .replace('{sightings}', sightingsText);

  const titles = [
    'Canopy Whisperer',
    'Grass Toucher Supreme',
    'Sunbeam Scout',
    'Moss Guardian',
    'Trailblazer of the Block',
    'Unplugged Ranger',
    'Breeze Listener',
  ];
  const titleAwarded = titles[Math.floor(Math.random() * titles.length)];

  return { reaction, titleAwarded };
}

export function getWeatherBonusQuest(
  companionId: CompanionId,
  isRainy: boolean,
  isFoggy: boolean,
  timeLabel: string
): Quest {
  const profile = COMPANION_PROFILES[companionId] || COMPANION_PROFILES.moss;

  if (isRainy) {
    return {
      id: `weather-rain-${Date.now()}`,
      title: 'Raindrop Petrichor Patrol (2x XP)',
      description:
        'Grab a raincoat or umbrella and step outside for 12 minutes. Smell the earthy petrichor scent, watch raindrops bead on leaves, and spot 3 glossy wet stones.',
      difficulty: 'Medium',
      minutes: 12,
      xp: 180,
      category: 'foliage',
      companionIntro: `${profile.name} is hyped: Rain means 2x XP and zero crowds outside!`,
      findName: 'Rain-Kissed Emerald Leaf',
      findType: 'leaf',
      isWeatherBonus: true,
      weatherBonusLabel: 'Rainy Day 2x XP Bonus',
    };
  }

  if (isFoggy) {
    return {
      id: `weather-fog-${Date.now()}`,
      title: 'Misty Hollow Explorer (2x XP)',
      description:
        'Walk into the misty air for 15 minutes and observe how fog softens distant trees into layered ink silhouettes. Check spiderwebs or grass tips for tiny dewdrops.',
      difficulty: 'Medium',
      minutes: 15,
      xp: 180,
      category: 'hiking',
      companionIntro: `${profile.name} whispers: The mist has unlocked 2x XP mythical trail vibes!`,
      findName: 'Mist-Veiled Quartz Stone',
      findType: 'stone',
      isWeatherBonus: true,
      weatherBonusLabel: 'Misty Morning 2x XP Bonus',
    };
  }

  if (timeLabel === 'Golden Hour' || timeLabel === 'Dawn') {
    return {
      id: `weather-gold-${Date.now()}`,
      title: `${timeLabel} Sunbeam Hunt (2x XP)`,
      description:
        'Step outside while the sun is low and golden. Find a tree canopy or street corridor catching warm amber rays and watch the long shadows stretch for 12 minutes.',
      difficulty: 'Medium',
      minutes: 12,
      xp: 180,
      category: 'stargazing',
      companionIntro: `${profile.name} cheers: ${timeLabel} light grants 2x XP right now!`,
      findName: 'Golden Hour Amber Leaf',
      findType: 'leaf',
      isWeatherBonus: true,
      weatherBonusLabel: `${timeLabel} 2x XP Bonus`,
    };
  }

  // Crisp Breeze / Clear Sky 2x Bonus Quest
  return {
    id: `weather-breeze-${Date.now()}`,
    title: 'Open-Sky Wind & Cloud Bonus (2x XP)',
    description:
      'Take advantage of today’s current sky conditions: walk 15 minutes to an open vantage point, feel the wind direction on your face, and spot a pollinator or bird riding the breeze.',
    difficulty: 'Medium',
    minutes: 15,
    xp: 180,
    category: 'birding',
    companionIntro: `${profile.name} says: Prime Open-Meteo conditions unlocked a 2x XP Weather Bonus!`,
    findName: 'Sunbeam Zephyr Feather',
    findType: 'bird',
    isWeatherBonus: true,
    weatherBonusLabel: 'Live Weather 2x XP Bonus',
  };
}

export function rollMysteryDiceQuest(companionId: CompanionId): {
  quest: Quest;
  diceValue: number;
  bonusXp: number;
} {
  const diceValue = Math.floor(Math.random() * 6) + 1; // 1 to 6
  const bonusMultipliers = [15, 25, 35, 50, 75, 120];
  const bonusXp = bonusMultipliers[diceValue - 1];
  const baseTemplate =
    OFFLINE_QUEST_BANK[Math.floor(Math.random() * OFFLINE_QUEST_BANK.length)];
  const profile = COMPANION_PROFILES[companionId] || COMPANION_PROFILES.moss;

  return {
    diceValue,
    bonusXp,
    quest: {
      ...baseTemplate,
      id: `mystery-dice-${Date.now()}`,
      title: `🎲 Mystery Roll #${diceValue}: ${baseTemplate.title}`,
      xp: baseTemplate.xp + bonusXp,
      companionIntro: `${profile.name} rolled a ${diceValue}! Complete this wildcard quest for +${bonusXp} bonus XP!`,
      isMysteryRoll: true,
      mysteryBonusXp: bonusXp,
    },
  };
}
