import type { WeatherData } from '../types';

export async function fetchLocalWeather(lat?: number, lon?: number, city?: string): Promise<WeatherData> {
  try {
    let targetLat = lat;
    let targetLon = lon;

    // If no coordinates provided, try Open-Meteo free geocoding API by city name
    if ((targetLat === undefined || targetLon === undefined) && city && city.trim().length > 1) {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=1&language=en&format=json`;
      const geoRes = await fetch(geoUrl);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData?.results?.[0]) {
          targetLat = geoData.results[0].latitude;
          targetLon = geoData.results[0].longitude;
        }
      }
    }

    // Default to a pleasant temperate coordinate if geocoding skipped/unavailable
    const finalLat = targetLat ?? 45.5152;
    const finalLon = targetLon ?? -122.6784;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${finalLat}&longitude=${finalLon}&current=temperature_2m,weather_code,wind_speed_10m`;
    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error('Weather API unavailable');

    const data = await res.json();
    const tempC = Math.round(data?.current?.temperature_2m ?? 18);
    const tempF = Math.round((tempC * 9) / 5 + 32);
    const code = data?.current?.weather_code ?? 1;
    const windSpeedKmh = Math.round(data?.current?.wind_speed_10m ?? 8);

    const { conditionText, isRainy, isFoggy, isClear } = decodeWeatherCode(code);

    return {
      temperatureC: tempC,
      temperatureF: tempF,
      conditionText,
      isRainy,
      isFoggy,
      isClear,
      windSpeedKmh,
      fetchedAt: Date.now(),
    };
  } catch {
    return {
      temperatureC: 17,
      temperatureF: 63,
      conditionText: 'Crisp Breeze & Dappled Sun',
      isRainy: false,
      isFoggy: false,
      isClear: true,
      windSpeedKmh: 9,
      fetchedAt: Date.now(),
    };
  }
}

function decodeWeatherCode(code: number): {
  conditionText: string;
  isRainy: boolean;
  isFoggy: boolean;
  isClear: boolean;
} {
  if (code === 0) return { conditionText: 'Clear Sky & Golden Sun', isRainy: false, isFoggy: false, isClear: true };
  if (code === 1 || code === 2)
    return { conditionText: 'Drifting Clouds & Sunbeams', isRainy: false, isFoggy: false, isClear: true };
  if (code === 3) return { conditionText: 'Cozy Overcast Canopy', isRainy: false, isFoggy: false, isClear: false };
  if (code >= 45 && code <= 48)
    return { conditionText: 'Misty Morning Fog', isRainy: false, isFoggy: true, isClear: false };
  if (code >= 51 && code <= 67)
    return { conditionText: 'Gentle Moss-Soaking Rain', isRainy: true, isFoggy: false, isClear: false };
  if (code >= 71 && code <= 77)
    return { conditionText: 'Crisp Frost & Snowflakes', isRainy: false, isFoggy: false, isClear: false };
  if (code >= 80 && code <= 82)
    return { conditionText: 'Refreshing Rain Showers', isRainy: true, isFoggy: false, isClear: false };
  if (code >= 95) return { conditionText: 'Electric Stormy Skies', isRainy: true, isFoggy: false, isClear: false };
  return { conditionText: 'Fresh Outdoor Breeze', isRainy: false, isFoggy: false, isClear: true };
}

export function getCurrentSeason(): 'Spring' | 'Summer' | 'Autumn' | 'Winter' {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Autumn';
  return 'Winter';
}

export function getTimeOfDayVibe(): {
  label: 'Dawn' | 'Morning' | 'Afternoon' | 'Golden Hour' | 'Night';
  tintClass: string;
  greeting: string;
} {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) {
    return {
      label: 'Dawn',
      tintClass: 'from-[#FFE5D4] via-[#FDFBF7] to-[#EBF1E8]',
      greeting: 'Early bird hours! The dew is still fresh.',
    };
  }
  if (hour >= 8 && hour < 12) {
    return {
      label: 'Morning',
      tintClass: 'from-[#EBF1E8] via-[#FDFBF7] to-[#D5E3CE]',
      greeting: 'Bright morning light awaits outside.',
    };
  }
  if (hour >= 12 && hour < 17) {
    return {
      label: 'Afternoon',
      tintClass: 'from-[#D5E3CE] via-[#FDFBF7] to-[#FFE5D4]',
      greeting: 'Peak daylight for a quick trail break.',
    };
  }
  if (hour >= 17 && hour < 20) {
    return {
      label: 'Golden Hour',
      tintClass: 'from-[#FFE5D4] via-[#FFF5EB] to-[#D5E3CE]',
      greeting: 'Golden hour shadows are stretching across the grass.',
    };
  }
  return {
    label: 'Night',
    tintClass: 'from-[#1E3F2B] via-[#2D5A3F] to-[#163020]',
    greeting: 'Quiet starlight and cool night air.',
  };
}
