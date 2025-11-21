/**
 * Utility functions for image path processing
 */

/**
 * Processes an image path to ensure it's properly formatted for use in the application.
 * - Replaces backslashes with forward slashes
 * - Removes ClientApp/public prefix if present
 * - Ensures proper leading slashes for asset paths
 * 
 * @param path - The image path to process (can be undefined or null)
 * @returns The processed image path, or undefined if the input was undefined/null/empty
 */
export function processImagePath(path: string | undefined | null): string | undefined {
  if (!path) return undefined;
  
  // Replace backslashes with forward slashes
  let processedPath = path.replace(/\\/g, '/');
  
  // Remove ClientApp/public prefix if present (handle both forward and backward slashes)
  processedPath = processedPath.replace(/^ClientApp\/public\//i, '');
  processedPath = processedPath.replace(/^ClientApp\\public\\/i, '');
  
  // If it starts with assets, make it relative to root
  if (processedPath.startsWith('assets/')) {
    processedPath = '/' + processedPath;
  } else if (processedPath.startsWith('/assets/')) {
    // Already has leading slash
  } else if (!processedPath.startsWith('/') && !processedPath.startsWith('http://') && !processedPath.startsWith('https://')) {
    // Add leading slash for absolute path from root (but not for external URLs)
    processedPath = '/' + processedPath;
  }
  
  return processedPath;
}

/**
 * Processes an image path similar to processImagePath, but returns an empty string
 * instead of undefined for invalid inputs (useful for cases requiring a string type).
 * 
 * @param path - The image path to process (can be undefined or null)
 * @returns The processed image path, or empty string if the input was undefined/null/empty
 */
export function processImagePathOrEmpty(path: string | undefined | null): string {
  return processImagePath(path) || '';
}
