// utils/formatters.ts

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters.toFixed(0)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}min`;
  }
  return `${hours}h ${mins}min`;
};

export const formatElevation = (meters: number): string => {
  return `${meters.toFixed(0)}m`;
};

export const formatSpeed = (metersPerSecond: number): string => {
  const kmh = metersPerSecond * 3.6;
  return `${kmh.toFixed(1)} km/h`;
};

export const formatPace = (metersPerSecond: number): string => {
  if (metersPerSecond === 0) return '0:00 /km';
  const minutesPerKm = 1000 / (metersPerSecond * 60);
  const mins = Math.floor(minutesPerKm);
  const secs = Math.floor((minutesPerKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')} /km`;
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date: Date | string): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const getDifficultyColor = (
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Expert'
): string => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-green-500';
    case 'Moderate':
      return 'bg-yellow-500';
    case 'Hard':
      return 'bg-orange-500';
    case 'Expert':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const formatCalories = (calories: number): string => {
  return `${calories.toFixed(0)} kcal`;
};