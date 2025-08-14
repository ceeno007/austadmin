/**
 * Creates a placeholder File object from a file URL or path
 * This is used when loading draft data that includes previously uploaded files
 */
export const createPlaceholderFile = (fileUrl: string): File => {
  // Derive a filename from the URL path
  let derivedName = 'document';
  try {
    const url = new URL(fileUrl, window.location.origin);
    const last = url.pathname.split('/').filter(Boolean).pop();
    if (last) {
      derivedName = decodeURIComponent(last);
    }
  } catch {
    // Fallback: attempt to parse as plain path
    const parts = fileUrl.split('?')[0].split('/');
    const last = parts.filter(Boolean).pop();
    if (last) derivedName = last;
  }

  // Infer a basic mime type from extension (best effort only)
  const lower = derivedName.toLowerCase();
  let mime = 'application/octet-stream';
  if (lower.endsWith('.pdf')) mime = 'application/pdf';
  else if (lower.endsWith('.png')) mime = 'image/png';
  else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) mime = 'image/jpeg';

  // Create an empty blob (do not embed any extra content)
  const blob = new Blob([], { type: mime });
  const file = new File([blob], derivedName, { type: mime });

  // Mark this file as a placeholder and preserve original URL for display/preview
  (file as any).originalPath = fileUrl;
  (file as any).isPlaceholder = true;
  return file;
};