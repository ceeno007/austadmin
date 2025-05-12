/**
 * Creates a placeholder File object from a file URL or path
 * This is used when loading draft data that includes previously uploaded files
 */
export const createPlaceholderFile = (fileUrl: string): File => {
  // Create a blob from the file URL
  const blob = new Blob([fileUrl], { type: 'application/octet-stream' });
  
  // Create a File object from the blob
  return new File([blob], 'placeholder', { type: 'application/octet-stream' });
}; 