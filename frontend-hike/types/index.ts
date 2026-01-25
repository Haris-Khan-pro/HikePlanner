export interface Trail {
  id: string;
  name: string;
  location: string;
  distance: number; // in kilometers
  duration: number; // in minutes
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Expert';
  elevation: number; // in meters
  rating: number; // 0-5
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
  distance: {
    min: number;
    max: number;
  };
  duration: {
    min: number;
    max: number;
  };
}

// Mock Data
export const mockTrails: Trail[] = [
  {
    id: '1',
    name: 'Eagle Peak Summit',
    location: 'Rocky Mountain National Park',
    distance: 12.5,
    duration: 240,
    difficulty: 'Hard',
    elevation: 850,
    rating: 4.8,
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
    description: 'Challenging trail with breathtaking summit views of the entire mountain range.',
    isFeatured: true,
    isPopular: true,
    isSaved: false,
    latitude: 40.3428,
    longitude: -105.6836,
    tags: ['Summit', 'Wildlife', 'Scenic Views'],
  },
  {
    id: '2',
    name: 'Lakeside Loop Trail',
    location: 'Crystal Lake State Park',
    distance: 5.2,
    duration: 90,
    difficulty: 'Easy',
    elevation: 120,
    rating: 4.5,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    description: 'Gentle loop around a pristine lake, perfect for families and beginners.',
    isFeatured: true,
    isPopular: true,
    isSaved: true,
    latitude: 39.7392,
    longitude: -104.9903,
    tags: ['Lake', 'Family Friendly', 'Waterfall'],
  },
  {
    id: '3',
    name: 'Forest Canyon Trail',
    location: 'Redwood National Forest',
    distance: 8.3,
    duration: 180,
    difficulty: 'Moderate',
    elevation: 450,
    rating: 4.7,
    reviews: 289,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    description: 'Winding trail through ancient forest with stunning canyon overlooks.',
    isFeatured: false,
    isPopular: true,
    isSaved: false,
    latitude: 41.2132,
    longitude: -124.0046,
    tags: ['Forest', 'Canyon', 'Photography'],
  },
  {
    id: '4',
    name: 'Sunset Ridge Hike',
    location: 'Cascade Mountain Range',
    distance: 6.8,
    duration: 150,
    difficulty: 'Moderate',
    elevation: 380,
    rating: 4.9,
    reviews: 421,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    description: 'Best sunset views in the region. Moderate climb with spectacular rewards.',
    isFeatured: true,
    isPopular: false,
    isSaved: true,
    latitude: 44.5645,
    longitude: -121.9782,
    tags: ['Sunset', 'Photography', 'Ridge'],
  },
  {
    id: '5',
    name: 'Alpine Meadow Path',
    location: 'Glacier National Park',
    distance: 4.5,
    duration: 105,
    difficulty: 'Easy',
    elevation: 200,
    rating: 4.6,
    reviews: 198,
    image: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5',
    description: 'Wildflower-filled meadows with mountain backdrops. Great for spring hiking.',
    isFeatured: false,
    isPopular: true,
    isSaved: false,
    latitude: 48.7596,
    longitude: -113.7870,
    tags: ['Meadow', 'Wildflowers', 'Easy'],
  },
  {
    id: '6',
    name: 'Devil\'s Backbone Ridge',
    location: 'Sierra Nevada Mountains',
    distance: 15.7,
    duration: 360,
    difficulty: 'Expert',
    elevation: 1200,
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e',
    description: 'Extreme trail for experienced hikers. Technical sections with exposure.',
    isFeatured: false,
    isPopular: false,
    isSaved: false,
    latitude: 37.7749,
    longitude: -119.4179,
    tags: ['Expert', 'Technical', 'Ridge'],
  },
  {
    id: '7',
    name: 'Waterfall Valley Trail',
    location: 'Yosemite National Park',
    distance: 7.2,
    duration: 165,
    difficulty: 'Moderate',
    elevation: 520,
    rating: 4.8,
    reviews: 634,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    description: 'Multiple waterfalls along the trail. Best visited in spring during snowmelt.',
    isFeatured: true,
    isPopular: true,
    isSaved: true,
    latitude: 37.8651,
    longitude: -119.5383,
    tags: ['Waterfall', 'Valley', 'Scenic'],
  },
  {
    id: '8',
    name: 'Pine Ridge Loop',
    location: 'Olympic National Forest',
    distance: 9.5,
    duration: 200,
    difficulty: 'Moderate',
    elevation: 610,
    rating: 4.4,
    reviews: 267,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    description: 'Dense pine forest with occasional clearings offering mountain views.',
    isFeatured: false,
    isPopular: false,
    isSaved: false,
    latitude: 47.8021,
    longitude: -123.6044,
    tags: ['Loop', 'Forest', 'Pine'],
  },
];

export const categories: Category[] = [
  { id: '1', name: 'All Trails', icon: '🏔️', count: 248 },
  { id: '2', name: 'Featured', icon: '⭐', count: 45 },
  { id: '3', name: 'Popular', icon: '🔥', count: 89 },
  { id: '4', name: 'Nearby', icon: '📍', count: 23 },
  { id: '5', name: 'Saved', icon: '❤️', count: 12 },
];