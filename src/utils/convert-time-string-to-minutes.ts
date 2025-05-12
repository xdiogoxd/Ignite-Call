export function convertTimeStringToMinutes(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error('Invalid time string');
  }

  return hours * 60 + minutes;
}
