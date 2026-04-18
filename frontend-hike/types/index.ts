export interface Trail {
  id: string;
  name: string;
  location: string;
  distance: number;
  duration: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Expert';
  elevation: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  isFeatured: boolean;
  isPopular: boolean;
  isSaved: boolean;
  latitude: number;
  longitude: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface FilterOptions {
  difficulty: string[];
  distance: { min: number; max: number };
  duration: { min: number; max: number };
}

export const mockTrails: Trail[] = [
  {
    id: '1',
    name: 'Fairy Meadows Trail',
    location: 'Nanga Parbat, Gilgit-Baltistan',
    distance: 14.0,
    duration: 300,
    difficulty: 'Moderate',
    elevation: 3300,
    rating: 4.9,
    reviews: 512,
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800',
    description: "One of Pakistan's most iconic treks leading to a lush meadow at the base of Nanga Parbat, the world's 9th highest peak. Stunning views of the Killer Mountain reward every step.",
    isFeatured: true,
    isPopular: true,
    isSaved: false,
    latitude: 35.3744,
    longitude: 74.5849,
    tags: ['Mountain Views', 'Meadow', 'Iconic', 'Photography'],
  },
  {
    id: '2',
    name: 'Nanga Parbat Base Camp',
    location: 'Diamer, Gilgit-Baltistan',
    distance: 28.5,
    duration: 540,
    difficulty: 'Hard',
    elevation: 4200,
    rating: 4.8,
    reviews: 278,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    description: "A challenging multi-day trek to the base of Nanga Parbat's Rupal Face — the world's highest mountain wall. Technical terrain demands experience and preparation.",
    isFeatured: true,
    isPopular: false,
    isSaved: false,
    latitude: 35.2375,
    longitude: 74.5892,
    tags: ['Base Camp', 'Expert Level', 'Glacier', 'Alpine'],
  },
  {
    id: '3',
    name: 'Naltar Valley Trek',
    location: 'Naltar, Gilgit-Baltistan',
    distance: 11.2,
    duration: 240,
    difficulty: 'Moderate',
    elevation: 2900,
    rating: 4.7,
    reviews: 334,
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800',
    description: 'Famous for its three multi-colored lakes and dense pine forests, Naltar Valley is a hidden gem offering spectacular views of surrounding snow-capped peaks.',
    isFeatured: true,
    isPopular: true,
    isSaved: true,
    latitude: 36.1667,
    longitude: 74.1833,
    tags: ['Colored Lakes', 'Pine Forest', 'Scenic', 'Wildlife'],
  },
  {
    id: '4',
    name: 'Deosai Plains Traverse',
    location: 'Deosai National Park, Gilgit-Baltistan',
    distance: 18.0,
    duration: 360,
    difficulty: 'Moderate',
    elevation: 4114,
    rating: 4.8,
    reviews: 401,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    description: "Trek across one of the world's highest plateaus, known as Land of Giants. Vast open grasslands, crystal streams, and the chance to spot Himalayan brown bears make this unforgettable.",
    isFeatured: false,
    isPopular: true,
    isSaved: false,
    latitude: 35.0392,
    longitude: 75.5503,
    tags: ['High Plateau', 'Wildlife', 'Brown Bears', 'Wildflowers'],
  },
  {
    id: '5',
    name: 'Ratti Gali Lake Trail',
    location: 'Neelum Valley, Azad Kashmir',
    distance: 9.5,
    duration: 210,
    difficulty: 'Moderate',
    elevation: 3700,
    rating: 4.9,
    reviews: 623,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    description: 'A breathtaking high-altitude alpine lake surrounded by snow-capped peaks in the heart of Azad Kashmir. The turquoise waters reflect the sky in a scene unlike any other in Pakistan.',
    isFeatured: true,
    isPopular: true,
    isSaved: true,
    latitude: 34.7297,
    longitude: 73.9703,
    tags: ['Alpine Lake', 'Azad Kashmir', 'Turquoise Water', 'Camping'],
  },
  {
    id: '6',
    name: 'Makra Peak Summit',
    location: 'Kaghan Valley, Khyber Pakhtunkhwa',
    distance: 13.0,
    duration: 300,
    difficulty: 'Hard',
    elevation: 3885,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    description: 'The highest peak accessible from Shogran, Makra offers a challenging summit push with panoramic 360° views of the Kaghan Valley and surrounding Himalayan ranges.',
    isFeatured: false,
    isPopular: true,
    isSaved: false,
    latitude: 34.6167,
    longitude: 73.4833,
    tags: ['Summit', 'Panoramic Views', 'Kaghan', 'Dawn Trek'],
  },
  {
    id: '7',
    name: 'Chitta Katha Lake',
    location: 'Neelum Valley, Azad Kashmir',
    distance: 7.8,
    duration: 180,
    difficulty: 'Moderate',
    elevation: 4100,
    rating: 4.8,
    reviews: 445,
    image: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800',
    description: "A pristine white lake perched high in the mountains of Azad Kashmir. Chitta means white in Kashmiri — the lake earns its name with milky glacial waters and a snow-ringed shoreline.",
    isFeatured: true,
    isPopular: true,
    isSaved: false,
    latitude: 34.7564,
    longitude: 74.0231,
    tags: ['Glacial Lake', 'White Lake', 'High Altitude', 'Remote'],
  },
  {
    id: '8',
    name: 'Margalla Hills Trail 5',
    location: 'Islamabad Capital Territory',
    distance: 4.2,
    duration: 90,
    difficulty: 'Easy',
    elevation: 320,
    rating: 4.5,
    reviews: 1240,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    description: "The most popular day hike from Pakistan's capital city. A well-marked trail through the Margalla Hills offering city views, abundant birdlife, and a refreshing escape from urban life.",
    isFeatured: false,
    isPopular: true,
    isSaved: false,
    latitude: 33.7450,
    longitude: 73.0979,
    tags: ['Beginner Friendly', 'City Views', 'Birdwatching', 'Day Hike'],
  },
];

export const categories: Category[] = [
  { id: '1', name: 'All Trails', icon: '🏔️', count: 248 },
  { id: '2', name: 'Featured',   icon: '⭐',  count: 45  },
  { id: '3', name: 'Popular',    icon: '🔥',  count: 89  },
  { id: '4', name: 'Nearby',     icon: '📍',  count: 23  },
  { id: '5', name: 'Saved',      icon: '❤️',  count: 12  },
];