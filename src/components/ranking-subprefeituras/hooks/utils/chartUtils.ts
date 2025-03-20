
/**
 * Generates an array of distinct colors for charts
 */
export const generateColors = (count: number): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate a HSL color
    const hue = (i * (360 / count)) % 360;
    const saturation = 60;
    const lightness = 60;
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};
