const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export function uploadToCloudinary(file, onProgress) {
  if (!cloudinaryConfigured) return Promise.reject(new Error('Cloudinary env vars not set'));

  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  fd.append('folder', 'solid-weddings');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

    if (onProgress) {
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      });
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const r = JSON.parse(xhr.responseText);
        resolve({ url: r.secure_url, publicId: r.public_id });
      } else {
        reject(new Error(`Cloudinary upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(fd);
  });
}

export async function uploadMultiple(files, onFileProgress) {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const r = await uploadToCloudinary(files[i], pct => onFileProgress?.(i, files.length, pct));
    results.push(r);
  }
  return results;
}
