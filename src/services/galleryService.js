
// Helper to manage gallery data and overrides
const CATEGORY_STORAGE_KEY = 'admin_category_config';
const ALBUM_STORAGE_KEY = 'admin_album_config';
const ALBUM_SETTINGS_KEY = 'admin_album_settings';

// --- CATEGORY CONFIG ---
export const getCategoryConfig = () => {
    try {
        const stored = localStorage.getItem(CATEGORY_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {
            order: [],
            renames: {},
            hidden: [],
            custom: [] // { id: 'unique_id', name: 'DisplayName' }
        };
    } catch (e) {
        return { order: [], renames: {}, hidden: [], custom: [] };
    }
};

export const saveCategoryConfig = (config) => {
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(config));
};

// --- ALBUM CONFIG (Virtual Albums) ---
export const getAlbumConfig = () => {
    try {
        const stored = localStorage.getItem(ALBUM_STORAGE_KEY);
        // Structure: [{ id: 'uuid', name: 'Album Name', categoryId: 'CatID', cover: 'base64/url', photos: ['base64/url'] }]
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const saveAlbumConfig = (albums) => {
    localStorage.setItem(ALBUM_STORAGE_KEY, JSON.stringify(albums));
};

// --- ALBUM SETTINGS (Settings for Filesystem Albums: Renames, Hidden) ---
export const getAlbumSettings = () => {
    try {
        const stored = localStorage.getItem(ALBUM_SETTINGS_KEY);
        return stored ? JSON.parse(stored) : {
            hidden: [], // Array of filesystem IDs e.g. "fs-Wedding-General"
            renames: {}, // Map of ID -> New Name
            hiddenPhotos: [], // Array of photo IDs (src paths) to hide
            addedPhotos: {}, // Map of AlbumID "fs-Wedding-General" -> Array of {src, ...}
            categoryOverrides: {}, // Map of AlbumID -> New CategoryID
            photoOrder: {} // Map of AlbumID -> Array of PhotoIDs (ordered)
        };
    } catch (e) {
        // Migration safety:
        return { hidden: [], renames: {}, hiddenPhotos: [], addedPhotos: {}, categoryOverrides: {}, photoOrder: {} };
    }
};

export const saveAlbumSettings = (settings) => {
    localStorage.setItem(ALBUM_SETTINGS_KEY, JSON.stringify(settings));
};


export const fetchGalleryData = async () => {
    const baseUrl = import.meta.env.BASE_URL;

    // Note: Use relative path to ensure compatibility. 
    // Extensions include uppercase for Linux case-sensitivity
    const modules = import.meta.glob('../../public/images/photos/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}');

    console.log("[GalleryService] Modules found:", Object.keys(modules).length);

    const data = {};
    const detectedCategories = new Set();

    // 1. Load File System Data
    for (const path in modules) {
        const parts = path.split('/');
        // path example: ../../public/images/photos/Wedding/Album1/img.jpg
        const photosIndex = parts.indexOf('photos');

        if (photosIndex !== -1 && parts.length > photosIndex + 2) {
            // Level 1: Category ID (Folder Name)
            const categoryId = decodeURIComponent(parts[photosIndex + 1]);
            detectedCategories.add(categoryId);

            let albumName = "General";
            if (parts.length > photosIndex + 3) {
                albumName = decodeURIComponent(parts[photosIndex + 2]);
            }

            const filename = parts[parts.length - 1];

            // Construct src: removing ../../public
            const relativePath = path.replace('../../public', '');
            const src = `${baseUrl.replace(/\/$/, '')}${relativePath}`;

            if (!data[categoryId]) {
                data[categoryId] = {
                    id: categoryId,
                    type: 'folder',
                    albums: {},
                    allImages: []
                };
            }

            if (!data[categoryId].albums[albumName]) {
                data[categoryId].albums[albumName] = [];
            }

            const imgObj = {
                id: src,
                src: src,
                alt: filename.split('.')[0],
                category: categoryId,
                album: albumName
            };

            data[categoryId].albums[albumName].push(imgObj);
            data[categoryId].allImages.push(imgObj);
        }
    }

    // 2. Load Configs
    const config = getCategoryConfig();
    const virtualAlbums = getAlbumConfig();
    const albumSettings = getAlbumSettings();
    // Use fallback for migration
    const hiddenPhotos = albumSettings.hiddenPhotos || [];
    const addedPhotosMap = albumSettings.addedPhotos || {};
    const categoryOverrides = albumSettings.categoryOverrides || {};
    const photoOrders = albumSettings.photoOrder || {};

    const finalData = { ...data };

    // Add Custom (Virtual) Categories
    config.custom.forEach(c => {
        if (!finalData[c.name]) {
            finalData[c.name] = {
                id: c.name,
                type: 'virtual',
                albums: {},
                allImages: []
            };
        }
    });

    // Merge Virtual Albums into Categories
    virtualAlbums.forEach(album => {
        const catId = album.categoryId;
        /* Note: Virtual Albums might refer to categories that don't exist in FS, but do exist in 'config.custom'.
           Also they might refer to FS categories.
           If the category is not initialized (not in FS and not in Config custom), create it?
           Usually we want to restrict to existing categories, but let's be safe.
        */
        if (!finalData[catId]) {
            // If virtual album references a missing category, create it provisionally
            finalData[catId] = { id: catId, type: 'virtual', albums: {}, allImages: [] };
        }

        if (!finalData[catId].albums[album.name]) {
            finalData[catId].albums[album.name] = [];
        }

        // Convert photos
        const albumImages = album.photos.map((src, idx) => ({
            id: `virtual-${album.id}-${idx}`,
            src: src,
            alt: album.name,
            category: catId,
            album: album.name
        }));

        finalData[catId].albums[album.name].push(...albumImages);
        finalData[catId].allImages.push(...albumImages);
    });

    // --- APPLY ALBUM SETTINGS (Hide/Rename/Photo Mod/MOVE) ---
    // Iterate over all categories and their albums

    // To handle Moves, we need a way to move an album from one category to another.
    // Iterating and mutating `finalData` in place is tricky if we move things.
    // Let's do a two-pass approach or careful iteration.

    // Strategy:
    // 1. Collect all "Moved" albums and "Regular" albums into a neutral list first?
    //    Or just process moves as we iterate. 
    //    Since moves are from FS source usually, we know their original location.

    // Let's iterate original structure, applying logic, and placing into NEW structure.
    const processedData = {};

    // Initialize processedData categories
    Object.keys(finalData).forEach(k => {
        processedData[k] = { ...finalData[k], albums: {}, allImages: [] };
        // Note: we clear albums and allImages to rebuild them
    });

    Object.keys(finalData).forEach(catId => {
        const originalAlbums = finalData[catId].albums;

        Object.keys(originalAlbums).forEach(origName => {
            const fsId = `fs-${catId}-${origName}`; // Is this reliable for virtuals?
            // Virtual IDs are different (uuids), but here 'origName' is just the key.
            // If it's a virtual album, we might not have an "fs-" ID easily unless we check.
            // But verify: Virtual albums are merged into `finalData` above.
            // Wait, if it's a VIRTUAL album, `origName` is its name.
            // But we don't have its UUID here easily to check `albumSettings`.
            // Virtual albums editing (Category change) is handled by `saveAlbumConfig` directly modifying `categoryId`.
            // So they naturally "Move" by just reloading with new config.
            // We ONLY care about categoryOverrides for FILESYSTEM albums here.

            // How to distinguish FS album from Virtual album in this loop?
            // Inspect the first photo?
            const firstPhoto = originalAlbums[origName][0];
            const isVirtual = firstPhoto && firstPhoto.id && String(firstPhoto.id).startsWith('virtual-');

            if (isVirtual) {
                // It's virtual, just put it where it is (it was already placed correctly by `virtualAlbums` loop above)
                // UNLESS we want to support some other settings.
                // But for now, just copy it over.
                // Note: Virtuals don't use `albumSettings` for moves, they update their config.
                if (!processedData[catId].albums[origName]) processedData[catId].albums[origName] = [];
                processedData[catId].albums[origName].push(...originalAlbums[origName]);
                return;
            }

            // It is FS (or mixed? Assuming FS primarily)

            // 1. Check Hidden
            if (albumSettings.hidden.includes(fsId)) {
                return; // Skip
            }

            // 2. Check Move (Category Override)
            let targetCatId = catId;
            if (categoryOverrides[fsId]) {
                targetCatId = categoryOverrides[fsId];
                // Ensure target category exists
                if (!processedData[targetCatId]) {
                    // Create if missing (e.g. moved to a disabled or new category)
                    processedData[targetCatId] = {
                        id: targetCatId,
                        type: 'virtual-container', // placeholder
                        albums: {},
                        allImages: []
                    };
                }
            }

            // 3. Check Rename
            const newName = albumSettings.renames[fsId] || origName;

            // 4. Process Photos
            let images = originalAlbums[origName];

            // Filter hidden photos
            images = images.filter(img => !hiddenPhotos.includes(img.id));

            // Append added photos
            if (addedPhotosMap[fsId]) {
                const existingSrcs = new Set(images.map(img => img.src));

                const extraImages = addedPhotosMap[fsId]
                    .filter(src => !existingSrcs.has(src)) // Deduplicate
                    .map((src, idx) => ({
                        id: src, // USE SRC AS ID to match Editor and FS conventions
                        src: src,
                        alt: newName,
                        category: targetCatId,
                        album: newName
                    }));
                images = [...images, ...extraImages];
            }

            // 5. Apply Sorting (Photo Order)
            if (photoOrders[fsId]) {
                const orderMap = new Map();
                photoOrders[fsId].forEach((id, index) => {
                    orderMap.set(id, index);
                });

                // Debug sorting for Wedding General
                if (fsId.includes('Wedding') && fsId.includes('General')) {
                    console.log(`[GalleryService] Sorting ${fsId}. OrderMap size: ${orderMap.size}`);
                    console.log('OrderMap Keys:', Array.from(orderMap.keys()));
                    console.log('Image IDs before sort:', images.map(i => i.id));
                }

                images.sort((a, b) => {
                    const idxA = orderMap.has(a.id) ? orderMap.get(a.id) : 999999;
                    const idxB = orderMap.has(b.id) ? orderMap.get(b.id) : 999999;
                    return idxA - idxB;
                });

                if (fsId.includes('Wedding') && fsId.includes('General')) {
                    console.log('Image IDs after sort:', images.map(i => i.id));
                }
            } else {
                if (fsId.includes('Wedding') && fsId.includes('General')) {
                    console.log(`[GalleryService] No photoOrder found for ${fsId}`);
                }
            }

            // Update metadata on images (Category and Album Name)
            images = images.map(img => ({ ...img, album: newName, category: targetCatId }));

            // Insert into Target
            if (!processedData[targetCatId].albums[newName]) {
                processedData[targetCatId].albums[newName] = [];
            }
            processedData[targetCatId].albums[newName].push(...images);
        });
    });

    // Rebuild allImages for every category
    Object.keys(processedData).forEach(pid => {
        Object.values(processedData[pid].albums).forEach(imgs => {
            processedData[pid].allImages.push(...imgs);
        });
    });

    const finalResult = processedData;

    // 3. Sorting and Category Display Logic
    let displayCategories = Object.keys(finalResult);
    displayCategories = displayCategories.filter(c => !config.hidden.includes(c));

    if (config.order.length > 0) {
        displayCategories.sort((a, b) => {
            const idxA = config.order.indexOf(a);
            const idxB = config.order.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });
    } else {
        const preferredOrder = ["Wedding", "Homecoming", "Destination", "Private Session", "Bridal", "Engagement"];
        displayCategories.sort((a, b) => {
            const idxA = preferredOrder.indexOf(a);
            const idxB = preferredOrder.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });
    }

    const categoryDisplays = displayCategories.map(id => ({
        id: id,
        displayName: config.renames[id] || id,
        data: finalResult[id]
    }));

    return {
        raw: finalResult,
        display: categoryDisplays
    };
};
