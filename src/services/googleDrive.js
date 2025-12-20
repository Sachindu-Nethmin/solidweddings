
const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/drive/v3/files';

/**
 * Fetches subfolders of a given folder.
 * @param {string} parentId - The ID of the parent folder.
 * @returns {Promise<Array>} - List of folder objects { id, name }.
 */
export const fetchFolders = async (parentId) => {
  if (!API_KEY) {
    console.error("Google Drive API Key is missing.");
    return [];
  }

  const query = `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}&fields=files(id, name)`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching folders: ${response.statusText}`);
    }
    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error("Failed to fetch folders:", error);
    return [];
  }
};

/**
 * Fetches image files from a specific folder.
 * @param {string} folderId - The ID of the folder to search in.
 * @returns {Promise<Array>} - List of image objects { id, name, webContentLink, thumbnailLink }.
 */
export const fetchImages = async (folderId) => {
  if (!API_KEY) {
    console.error("Google Drive API Key is missing.");
    return [];
  }

  const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;
  // requesting webContentLink (download) and thumbnailLink
  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}&fields=files(id, name, webContentLink, thumbnailLink)`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching images: ${response.statusText}`);
    }
    const data = await response.json();
    return data.files ? data.files.map(file => ({
        id: file.id,
        // Use thumbnailLink for better performance in grid, or webContentLink for full res.
        // Google Drive thumbnail links can be resized by appending =s{size} e.g. =s1000
        src: file.thumbnailLink ? file.thumbnailLink.replace('=s220', '=s1200') : file.webContentLink, 
        alt: file.name,
        category: folderId // We can use folderId or map it back to name if needed
    })) : [];
  } catch (error) {
    console.error("Failed to fetch images:", error);
    return [];
  }
};
