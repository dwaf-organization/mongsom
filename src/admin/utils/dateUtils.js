export const formatDate = iso => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
};

export const pickFirstImageUrl = arr => {
  if (!Array.isArray(arr)) return '';
  const first = arr.find(u => typeof u === 'string' && u.startsWith('http'));
  return first || '';
};

export const getFirstThumb = order => {
  const first = order?.orderDetails?.[0];
  if (!first) return null;
  return Array.isArray(first.productImgUrls)
    ? first.productImgUrls[0] || null
    : first.productImgUrls || null;
};
