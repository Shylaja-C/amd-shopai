import fs from 'fs';

const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));

// Function to get a reliable placeholder based on category
const getPlaceholder = (category, id) => {
  // Use picsum photos with a seeded ID so they are consistent but unique
  const seed = id + 100;
  return `https://picsum.photos/seed/${category}${seed}/400/400`;
};

products.forEach(p => {
  p.image = getPlaceholder(p.category, p.id);
});

fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
console.log('Successfully updated all product images to reliable placeholders.');
