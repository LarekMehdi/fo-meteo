const weatherIconMap: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '🌤️',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌧️',
  53: '🌧️',
  55: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  71: '❄️',
  73: '❄️',
  75: '❄️',
  80: '🌦️',
  81: '🌧️',
  82: '⛈️',
  95: '⛈️',
};

export function getWeatherIcon(code: number): string {
  return weatherIconMap[code] ?? '❓';
}
