export const FOOD_IMAGE_MAP: Record<string, string> = {
  // Breakfast
  'Kanda Poha': '/images/menu/poha.jpg',
  'Rava Upma': '/images/menu/upma.jpg',
  'Steamed Idli Sambar (4 Pcs)': '/images/menu/idli-sambar.jpg',
  'Crispy Medu Vada (2 Pcs)': '/images/menu/medu-vada.jpg',
  'Bombay Toast Sandwich': '/images/menu/toast-sandwich.jpg',
  'Double Egg Bread Omelette': '/images/menu/bread-omelette.jpg',
  'Punjabi Aloo Paratha (With Curd)': '/images/menu/aloo-paratha.jpg',
  'Crispy Masala Dosa': '/images/menu/masala-dosa.jpg',

  // Main Course
  'Deluxe Special Veg Thali': '/images/menu/veg-thali.jpg',
  'Paneer Butter Masala Combo': '/images/menu/paneer-butter-masala.jpg',
  'Yellow Dal Fry & Jeera Rice': '/images/menu/dal-fry.jpg',
  'Hyderabadi Veg Dum Biryani': '/images/menu/veg-biryani.jpg',
  'Chicken Dum Biryani': '/images/menu/chicken-biryani.jpg',
  'Delhi Style Butter Chicken & Naan': '/images/menu/butter-chicken.jpg',
  'Homestyle Chicken Curry Meal': '/images/menu/chicken-curry.jpg',
  'Spicy Egg Curry (2 Eggs)': '/images/menu/egg-curry.jpg',

  // Fast Food
  'Crispy Veg Cheese Burger': '/images/menu/veg-burger.jpg',
  'Crispy Chicken Zinger Burger': '/images/menu/chicken-zinger-burger.jpg',
  'Farmhouse Veg Pizza (7 Inch)': '/images/menu/veg-pizza.jpg',
  'Chicken BBQ Pizza (7 Inch)': '/images/menu/chicken-bbq-pizza.jpg',
  'Peri Peri Salted French Fries': '/images/menu/french-fries.jpg',
  'Steamed Veg Momos (6 Pcs)': '/images/menu/veg-momos.jpg',
  'Steamed Chicken Momos (6 Pcs)': '/images/menu/chicken-momos.jpg',
  'Hakka Veg Noodles': '/images/menu/hakka-noodles.jpg',
  'Schezwan Egg Fried Rice': '/images/menu/egg-fried-rice.jpg',

  // Snacks
  'Samosa Pav (Set of 2)': '/images/menu/samosa-pav.jpg',
  'Classic Veg Cheese Grill Sandwich': '/images/menu/cheese-sandwich.jpg',
  'Pyaz Kachori (Set of 2)': '/images/menu/pyaz-kachori.jpg',
  'Crispy Veg Spring Rolls': '/images/menu/spring-rolls.jpg',
  'Cheese Garlic Bread Toast': '/images/menu/garlic-bread.jpg',
  'Chicken Frankie Roll': '/images/menu/chicken-frankie.jpg',
  'Crispy Cheese Corn Balls (6 Pcs)': '/images/menu/cheese-corn-balls.jpg',
  'Indo-Chinese Chilli Paneer Dry': '/images/menu/chilli-paneer.jpg',

  // Beverages
  'Kulhad Masala Chai': '/images/menu/masala-chai.jpg',
  'Filter Coffee': '/images/menu/filter-coffee.jpg',
  'Cold Coffee with Ice Cream': '/images/menu/cold-coffee.jpg',
  'Fresh Mint Lime Soda': '/images/menu/mint-lime-soda.jpg',
  'Oreo Chocolate Milkshake': '/images/menu/oreo-milkshake.jpg',

  // Desserts
  'Hot Gulab Jamun (2 Pcs)': '/images/menu/gulab-jamun.jpg',
  'Vanilla Bean Ice Cream Scoop': '/images/menu/vanilla-ice-cream.jpg',
  'Chocolate Brownie Sundae': '/images/menu/brownie-sundae.jpg',
  'Belgian Dark Chocolate Pastry': '/images/menu/dark-chocolate-pastry.jpg',
};

export const getFoodImageByName = (foodName: string): string => {
  if (!foodName) return '/images/menu/default-food.jpg';
  const found = FOOD_IMAGE_MAP[foodName.trim()];
  if (found) return found;

  // Fallback keyword matching for dynamic items
  const nameLower = foodName.toLowerCase();
  if (nameLower.includes('poha')) return '/images/menu/poha.jpg';
  if (nameLower.includes('upma')) return '/images/menu/upma.jpg';
  if (nameLower.includes('idli')) return '/images/menu/idli-sambar.jpg';
  if (nameLower.includes('vada')) return '/images/menu/medu-vada.jpg';
  if (nameLower.includes('dosa')) return '/images/menu/masala-dosa.jpg';
  if (nameLower.includes('paratha')) return '/images/menu/aloo-paratha.jpg';
  if (nameLower.includes('paneer')) return '/images/menu/paneer-butter-masala.jpg';
  if (nameLower.includes('dal')) return '/images/menu/dal-fry.jpg';
  if (nameLower.includes('chicken biryani')) return '/images/menu/chicken-biryani.jpg';
  if (nameLower.includes('veg biryani') || nameLower.includes('biryani')) return '/images/menu/veg-biryani.jpg';
  if (nameLower.includes('butter chicken')) return '/images/menu/butter-chicken.jpg';
  if (nameLower.includes('chicken burger') || nameLower.includes('zinger')) return '/images/menu/chicken-zinger-burger.jpg';
  if (nameLower.includes('burger')) return '/images/menu/veg-burger.jpg';
  if (nameLower.includes('chicken pizza') || nameLower.includes('bbq')) return '/images/menu/chicken-bbq-pizza.jpg';
  if (nameLower.includes('pizza')) return '/images/menu/veg-pizza.jpg';
  if (nameLower.includes('fries')) return '/images/menu/french-fries.jpg';
  if (nameLower.includes('noodle')) return '/images/menu/hakka-noodles.jpg';
  if (nameLower.includes('samosa')) return '/images/menu/samosa-pav.jpg';
  if (nameLower.includes('sandwich')) return '/images/menu/cheese-sandwich.jpg';
  if (nameLower.includes('frankie') || nameLower.includes('roll')) return '/images/menu/chicken-frankie.jpg';
  if (nameLower.includes('chai') || nameLower.includes('tea')) return '/images/menu/masala-chai.jpg';
  if (nameLower.includes('cold coffee')) return '/images/menu/cold-coffee.jpg';
  if (nameLower.includes('coffee')) return '/images/menu/filter-coffee.jpg';
  if (nameLower.includes('milkshake') || nameLower.includes('shake')) return '/images/menu/oreo-milkshake.jpg';
  if (nameLower.includes('brownie')) return '/images/menu/brownie-sundae.jpg';
  if (nameLower.includes('ice cream')) return '/images/menu/vanilla-ice-cream.jpg';
  if (nameLower.includes('gulab jamun')) return '/images/menu/gulab-jamun.jpg';

  return '/images/menu/default-food.jpg';
};
