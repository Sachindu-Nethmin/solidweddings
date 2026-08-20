const modules = import.meta.glob('../../public/images/photos/**/*.{jpg,jpeg,png,webp,avif}');

function parsePhotos() {
  const baseUrl = import.meta.env.BASE_URL;
  const cats = {};

  for (const path in modules) {
    const parts = path.split('/');
    const photosIdx = parts.indexOf('photos');
    const catId = parts[photosIdx + 1];
    const albumName = parts[photosIdx + 2] || 'General';
    const file = parts.slice(photosIdx + 3).join('/');
    const src = `${baseUrl.replace(/\/$/, '')}/images/photos/${catId}/${albumName !== 'General' ? albumName + '/' : ''}${file}`;

    if (!cats[catId]) cats[catId] = { id: catId, albums: {} };
    if (!cats[catId].albums[albumName]) cats[catId].albums[albumName] = [];
    cats[catId].albums[albumName].push({ url: src, alt: file, category: catId, album: albumName });
  }

  return Object.values(cats).map(c => ({
    ...c,
    photos: Object.values(c.albums).flat(),
  }));
}

const CATEGORIES = parsePhotos();

export function allPhotos(categories) {
  return categories.flatMap(c => c.photos || []);
}

export function useGallery() {
  return { categories: CATEGORIES };
}
