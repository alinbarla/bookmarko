export const VIVID_PASTEL_COLORS = {
  PINK: '#FF99C8',
  YELLOW: '#FFD700',
  GREEN: '#77DD77',
  BLUE: '#89CFF0',
  ORANGE: '#FFB347',
  PURPLE: '#CBAACB',
  RED: '#FF6961',
  TEAL: '#77BFC7',
} as const;

export type VividPastelColor = typeof VIVID_PASTEL_COLORS[keyof typeof VIVID_PASTEL_COLORS];

export const getRandomColor = (): VividPastelColor => {
  const colors = Object.values(VIVID_PASTEL_COLORS);
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getContrastColor = (hexcolor: string): 'black' | 'white' => {
  // Convert hex to RGB
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? 'black' : 'white';
}; 