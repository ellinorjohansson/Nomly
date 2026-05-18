const HOURS_IN_MINUTES = 60;

export const parseDurationToMinutes = (value?: string) => {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (!normalizedValue) {
    return null;
  }

  const hoursMatch = normalizedValue.match(/(\d+)\s*h/);
  const minutesMatch = normalizedValue.match(/(\d+)\s*m/);

  if (hoursMatch || minutesMatch) {
    const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;
    return hours * HOURS_IN_MINUTES + minutes;
  }

  const plainNumberMatch = normalizedValue.match(/^\d+$/);
  return plainNumberMatch ? Number(plainNumberMatch[0]) : null;
};

export const formatMinutesAsDuration = (totalMinutes: number) => {
  if (totalMinutes < HOURS_IN_MINUTES) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / HOURS_IN_MINUTES);
  const minutes = totalMinutes % HOURS_IN_MINUTES;

  if (!minutes) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
};

export const formatDuration = (value?: string) => {
  if (!value) {
    return "";
  }

  const totalMinutes = parseDurationToMinutes(value);
  return totalMinutes !== null ? formatMinutesAsDuration(totalMinutes) : value;
};
