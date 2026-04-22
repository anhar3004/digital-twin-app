export const getImageUrl = (path: string | null) => {
  if (!path) return 'https://placehold.co/600x400?text=No+Image';

  // Jika sudah berupa URL (seperti link placeholder dari seeder), langsung return
  if (path.startsWith('http')) return path;

  // Jika hanya nama file (misal: "mixer-6kg.png"), arahkan ke folder public backend
  const baseUrl = 'http://localhost:3000/public/uploads';
  return `${baseUrl}/${path}`;
};
