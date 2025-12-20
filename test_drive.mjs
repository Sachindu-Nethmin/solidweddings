// import fetch from 'node-fetch'; // Relying on global fetch in Node 18+

const API_KEY = 'AIzaSyD2K4juCRz0B-QhprbmbWsiPtXZ0-FGa8E';
const ROOT_FOLDER_ID = '1BmgG2LCAWrK9kDXIcjB8rWwYXNCg2Uxv';
const BASE_URL = 'https://www.googleapis.com/drive/v3/files';

async function testDriveAPI() {
    console.log(`Testing Google Drive API for Root Folder ID: ${ROOT_FOLDER_ID}`);

    // 1. Fetch Folders
    const query = `'${ROOT_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    const foldersUrl = `${BASE_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}&fields=files(id, name)`;

    // console.log(`Fetching folders from: ${foldersUrl}`);

    try {
        const response = await fetch(foldersUrl);
        const data = await response.json();

        if (data.error) {
            console.error('Error fetching folders:', data.error);
            return;
        }

        console.log('FOLDERS_COUNT:', data.files ? data.files.length : 0);

        if (data.files && data.files.length > 0) {
            data.files.forEach(folder => {
                console.log(`- Folder: ${folder.name} (ID: ${folder.id})`);
            });

            // 2. Fetch Images from the first folder
            const firstFolderId = data.files[0].id;
            const imgQuery = `'${firstFolderId}' in parents and mimeType contains 'image/' and trashed = false`;
            const imagesUrl = `${BASE_URL}?q=${encodeURIComponent(imgQuery)}&key=${API_KEY}&fields=files(id, name, webContentLink, thumbnailLink)`;

            // console.log(`Fetching images from first folder (${firstFolderId})...`);

            const imgResponse = await fetch(imagesUrl);
            const imgData = await imgResponse.json();

            if (imgData.error) {
                console.error('Error fetching images:', imgData.error);
            } else {
                console.log('IMAGES_COUNT:', imgData.files ? imgData.files.length : 0);
                if (imgData.files && imgData.files.length > 0) {
                    console.log('First image details:', imgData.files[0]);
                    console.log('Thumbnail Link:', imgData.files[0].thumbnailLink);
                    console.log('WebContent Link:', imgData.files[0].webContentLink);
                }
            }
        } else {
            console.log('No folders found in the root folder.');
        }

    } catch (error) {
        console.error('Network or other error:', error);
    }
}

testDriveAPI();
