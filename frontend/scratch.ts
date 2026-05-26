import { products, filterProducts, categories } from './lib/data';

const query = 'клавиатура'.toLowerCase();

products.forEach(p => {
  const category = categories.find(c => c.slug === p.category)
  if (p.category === 'keyboards') {
    console.log("Product:", p.name.ru);
    console.log("Category name:", category?.name.ru);
    console.log("Category lower:", category?.name.ru.toLowerCase());
    console.log("Query:", query);
    console.log("Includes:", category?.name.ru.toLowerCase().includes(query));
  }
});
