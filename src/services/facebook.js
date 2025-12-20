
const ACCESS_TOKEN = import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN;
const BASE_URL = 'https://graph.facebook.com/v18.0';

/**
 * Fetches albums from a Facebook Page.
 * @param {string} pageId - The ID of the Facebook Page.
 * @returns {Promise<Array>} - List of album objects.
 */
export const fetchAlbums = async (pageId) => {
    if (!ACCESS_TOKEN) {
        console.error("Facebook Access Token is missing.");
        return [];
    }

    // Fetch albums with their cover photos
    const url = `${BASE_URL}/${pageId}/albums?fields=id,name,cover_photo{picture}&access_token=${ACCESS_TOKEN}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching albums: ${response.statusText}`);
        }
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Failed to fetch albums:", error);
        return [];
    }
};

/**
 * Fetches photos from a specific album.
 * @param {string} albumId - The ID of the album.
 * @returns {Promise<Array>} - List of photo objects.
 */
export const fetchPhotos = async (albumId) => {
    if (!ACCESS_TOKEN) {
        console.error("Facebook Access Token is missing.");
        return [];
    }

    // Fetch photos with their source (image URL) and higher resolution images
    const url = `${BASE_URL}/${albumId}/photos?fields=id,name,images,source&access_token=${ACCESS_TOKEN}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching photos: ${response.statusText}`);
        }
        const data = await response.json();

        return data.data ? data.data.map(photo => ({
            id: photo.id,
            // Get the largest image (usually the first one in the images array)
            src: photo.images && photo.images.length > 0 ? photo.images[0].source : photo.source,
            alt: photo.name || 'Gallery Image',
            category: albumId // We use albumId to link back to the category
        })) : [];
    } catch (error) {
        console.error("Failed to fetch photos:", error);
        return [];
    }
};
