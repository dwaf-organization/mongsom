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
