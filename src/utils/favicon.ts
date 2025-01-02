/**
 * Gets the favicon URL for a given website URL
 * First tries the Google Favicon service, falls back to the website's default favicon
 */
export const getFaviconUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    // Use Google's favicon service for best results
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch (error) {
    // Return a default icon if URL parsing fails
    return 'src/assets/favicon-32x32.png';
  }
}; 