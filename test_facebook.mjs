// import fetch from 'node-fetch'; // Relying on global fetch in Node 18+

// SANITIZED: Access Token should be loaded from environment variables
const ACCESS_TOKEN = process.env.VITE_FACEBOOK_ACCESS_TOKEN || 'YOUR_TOKEN_HERE';
const BASE_URL = 'https://graph.facebook.com/v18.0';

async function testFacebookAPI() {
    if (!process.env.VITE_FACEBOOK_ACCESS_TOKEN) {
        console.warn("Warning: VITE_FACEBOOK_ACCESS_TOKEN is not set. Using placeholder.");
    }

    // 1. Debug Token Identity
    const debugUrl = `${BASE_URL}/me?fields=id,name&access_token=${ACCESS_TOKEN}`;
    console.log(`Debugging token: ${debugUrl}`);

    try {
        const response = await fetch(debugUrl);
        const data = await response.json();
        console.log('Token Identity Name:', data.name);
        console.log('Token Identity ID:', data.id);

        if (data.id) {
            // If we get an ID, try to fetch albums using that ID
            const realPageId = data.id;
            console.log(`Using ID from token: ${realPageId}`);

            const albumsUrl = `${BASE_URL}/${realPageId}/albums?fields=id,name,cover_photo{picture}&access_token=${ACCESS_TOKEN}`;
            console.log(`Fetching albums from: ${albumsUrl}`);

            const albumsResponse = await fetch(albumsUrl);
            const albumsData = await albumsResponse.json();
            console.log('Albums result:', albumsData);

            if (albumsData.data && albumsData.data.length > 0) {
                const firstAlbumId = albumsData.data[0].id;
                const photosUrl = `${BASE_URL}/${firstAlbumId}/photos?fields=id,name,images,source&access_token=${ACCESS_TOKEN}`;
                console.log(`Fetching photos from first album (${firstAlbumId})...`);
                const photosResponse = await fetch(photosUrl);
                const photosData = await photosResponse.json();
                console.log('Photos result:', photosData);
            }
        } else if (data.error) {
            console.error('Token Error:', data.error);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testFacebookAPI();
