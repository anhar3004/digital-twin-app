export const getImageUrl = (path: string | null) => {
  if (!path) return 'https://placehold.co/600x400?text=No+Image';
  
  if (path.startsWith('http')) return path;

  const baseUrl = `${import.meta.env.VITE_API_URL}/public/uploads`;
  
  return `${baseUrl}/${path}`;
};
