export const FOOD_IMAGE_MAP: Record<string, string> = {
  // Breakfast Items
  'Kanda Poha': '/images/menu/kanda-poha.jpg',
  'Rava Upma': '/images/menu/rava-upma.jpg',
  'Steamed Idli Sambar (4 Pcs)': '/images/menu/steamed-idli-sambar.jpg',
  'Steamed Idli Sambar': '/images/menu/steamed-idli-sambar.jpg',
  'Crispy Medu Vada (2 Pcs)': '/images/menu/crispy-medu-vada.jpg',
  'Crispy Medu Vada': '/images/menu/crispy-medu-vada.jpg',
  'Bombay Toast Sandwich': '/images/menu/bombay-toast-sandwich.jpg',
  'Double Egg Bread Omelette': '/images/menu/double-egg-bread-omelette.jpg',
  'Punjabi Aloo Paratha (With Curd)': '/images/menu/punjabi-aloo-paratha.jpg',
  'Punjabi Aloo Paratha': '/images/menu/punjabi-aloo-paratha.jpg',
  'Crispy Masala Dosa': '/images/menu/crispy-masala-dosa.jpg',

  // Main Course Items
  'Deluxe Special Veg Thali': '/images/menu/deluxe-special-veg-thali.jpg',
  'Paneer Butter Masala Combo': '/images/menu/paneer-butter-masala-combo.jpg',
  'Yellow Dal Fry & Jeera Rice': '/images/menu/yellow-dal-fry-jeera-rice.jpg',
  'Hyderabadi Veg Dum Biryani': '/images/menu/hyderabadi-veg-dum-biryani.jpg',
  'Chicken Dum Biryani': '/images/menu/chicken-dum-biryani.jpg',
  'Delhi Style Butter Chicken & Naan': '/images/menu/delhi-style-butter-chicken-naan.jpg',
  'Homestyle Chicken Curry Meal': '/images/menu/homestyle-chicken-curry-meal.jpg',

  // Fast Food Items
  'Farmhouse Veg Pizza (7 Inch)': '/images/menu/farmhouse-veg-pizza.jpg',
  'Farmhouse Veg Pizza': '/images/menu/farmhouse-veg-pizza.jpg',
  'Chicken BBQ Pizza (7 Inch)': '/images/menu/chicken-bbq-pizza.jpg',
  'Chicken BBQ Pizza': '/images/menu/chicken-bbq-pizza.jpg',
  'Crispy Veg Cheese Burger': '/images/menu/crispy-veg-cheese-burger.jpg',
  'Crispy Chicken Zinger Burger': '/images/menu/crispy-chicken-zinger-burger.jpg',
  'Peri Peri Salted French Fries': '/images/menu/peri-peri-french-fries.jpg',
  'Peri Peri French Fries': '/images/menu/peri-peri-french-fries.jpg',
  'Steamed Veg Momos (6 Pcs)': '/images/menu/steamed-veg-momos.jpg',
  'Steamed Veg Momos': '/images/menu/steamed-veg-momos.jpg',
  'Steamed Chicken Momos (6 Pcs)': '/images/menu/steamed-chicken-momos.jpg',
  'Steamed Chicken Momos': '/images/menu/steamed-chicken-momos.jpg',
  'Hakka Veg Noodles': '/images/menu/hakka-veg-noodles.jpg',
  'Schezwan Egg Fried Rice': '/images/menu/schezwan-egg-fried-rice.jpg',

  // Snacks Items
  'Samosa Pav (Set of 2)': '/images/menu/samosa-pav.jpg',
  'Samosa Pav': '/images/menu/samosa-pav.jpg',
  'Classic Veg Cheese Grill Sandwich': '/images/menu/classic-veg-cheese-grill-sandwich.jpg',
  'Pyaz Kachori (Set of 2)': '/images/menu/pyaz-kachori.jpg',
  'Pyaz Kachori': '/images/menu/pyaz-kachori.jpg',
  'Crispy Veg Spring Rolls': '/images/menu/crispy-veg-spring-rolls.jpg',
  'Cheese Garlic Bread Toast': '/images/menu/cheese-garlic-bread-toast.jpg',
  'Chicken Frankie Roll': '/images/menu/chicken-frankie-roll.jpg',
  'Crispy Cheese Corn Balls (6 Pcs)': '/images/menu/crispy-cheese-corn-balls.jpg',
  'Crispy Cheese Corn Balls': '/images/menu/crispy-cheese-corn-balls.jpg',
  'Indo-Chinese Chilli Paneer Dry': '/images/menu/chilli-paneer-dry.jpg',

  // Beverages Items
  'Kulhad Masala Chai': '/images/menu/kulhad-masala-chai.jpg',
  'Filter Coffee': '/images/menu/filter-coffee.jpg',
  'Cold Coffee with Ice Cream': '/images/menu/cold-coffee-with-ice-cream.jpg',
  'Fresh Mint Lime Soda': '/images/menu/fresh-mint-lime-soda.jpg',
  'Oreo Chocolate Milkshake': '/images/menu/oreo-chocolate-milkshake.jpg',

  // Desserts Items
  'Hot Gulab Jamun (2 Pcs)': '/images/menu/hot-gulab-jamun.jpg',
  'Hot Gulab Jamun': '/images/menu/hot-gulab-jamun.jpg',
  'Vanilla Bean Ice Cream Scoop': '/images/menu/vanilla-bean-ice-cream-scoop.jpg',
  'Chocolate Brownie Sundae': '/images/menu/chocolate-brownie-sundae.jpg',
  'Belgian Dark Chocolate Pastry': '/images/menu/belgian-dark-chocolate-pastry.jpg',
  'Fresh Bengali Rasgulla': '/images/menu/fresh-bengali-rasgulla.jpg',
  'Warm Choco Lava Cake': '/images/menu/warm-choco-lava-cake.jpg',
};

export const DEFAULT_FOOD_IMAGE = '/images/menu/default-food.jpg';

export const nameToSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getFoodImageByName = (foodName: string): string => {
  if (!foodName) return DEFAULT_FOOD_IMAGE;
  const trimmed = foodName.trim();
  if (FOOD_IMAGE_MAP[trimmed]) return FOOD_IMAGE_MAP[trimmed];

  // Try matching stripped version (removing portion parens like "(Set of 2)")
  const strippedName = trimmed.replace(/\s*\([^)]*\)/g, '').trim();
  if (FOOD_IMAGE_MAP[strippedName]) return FOOD_IMAGE_MAP[strippedName];

  // Generate slug path dynamically
  const slug = nameToSlug(foodName);
  if (slug) return `/images/menu/${slug}.jpg`;

  return DEFAULT_FOOD_IMAGE;
};
