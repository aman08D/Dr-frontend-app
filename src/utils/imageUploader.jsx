const CLOUD_NAME = 'g2vyzd9r';
const UPLOAD_PRESET = 'dr_preset';

export const uploadImageToCloud = async (file) => { // Naam badal kar 'uploadImageToCloud' kar diya
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary Error:', error);
    return null;
  }
};

export const cleanWebImageUrl = (inputUrl) => {
  if (!inputUrl) return '';
  let url = inputUrl.trim();
  if (url.includes('google.com') && url.includes('imgurl=')) {
    try {
      const parsed = new URL(url);
      const rawImgUrl = parsed.searchParams.get('imgurl');
      if (rawImgUrl) return decodeURIComponent(rawImgUrl);
    } catch (e) { }
  }
  return url;
};