import { apiClient } from '../client';
import { getFoodImageByName } from '@/lib/FoodImageMap';
import { ApiResponse } from '@/types/api';
import {
  MenuItem,
  Category,
  StudentOrder,
  QueueStatus,
  PickupSlot,
  CartItem,
  PaymentMethod,
  StudentStats,
  CanteenNotification,
  StudentAnalytics,
} from '@/types/student';
import { FOOD_CATEGORIES, PICKUP_SLOTS } from '@/constants/menu';

export interface PlaceOrderPayload {
  items: CartItem[];
  pickupSlot: string;
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
  couponCode?: string;
}

export interface IStudentApiService {
  getMenu(): Promise<ApiResponse<MenuItem[]>>;
  getCategories(): Promise<ApiResponse<Category[]>>;
  getActiveOrder(): Promise<ApiResponse<StudentOrder | null>>;
  getQueueStatus(orderId: string): Promise<ApiResponse<QueueStatus | null>>;
  placeOrder(payload: PlaceOrderPayload): Promise<ApiResponse<StudentOrder>>;
  getOrderHistory(): Promise<ApiResponse<StudentOrder[]>>;
  reorder(orderId: string): Promise<ApiResponse<StudentOrder>>;
  getPickupSlots(): Promise<ApiResponse<PickupSlot[]>>;
  getStudentStats(): Promise<ApiResponse<StudentStats>>;
  getRecommendedItems(): Promise<ApiResponse<MenuItem[]>>;
  getTrendingItems(): Promise<ApiResponse<MenuItem[]>>;
  getNotifications(): Promise<ApiResponse<CanteenNotification[]>>;
  getStudentAnalytics(): Promise<ApiResponse<StudentAnalytics>>;
  toggleFavoriteItem(itemId: string): Promise<ApiResponse<{ isFavorite: boolean }>>;
}

class StudentApiService implements IStudentApiService {
  async getMenu(): Promise<ApiResponse<MenuItem[]>> {
    try {
      const response = await apiClient.get<any>('/menu');
      const rawData = response.data?.data || response.data;
      if (Array.isArray(rawData) && rawData.length > 0) {
        const mappedItems: MenuItem[] = rawData.map((item: any) => ({
          id: item.id || `item-${Math.random()}`,
          name: item.name,
          description: item.description || 'Fresh canteen preparation',
          priceInINR: item.price || item.priceInINR || 50,
          category: (item.category || 'main_course').toLowerCase().replace(/\s+/g, '_'),
          imageUrl: item.image_url || getFoodImageByName(item.name),
          isAvailable: item.is_available ?? item.isAvailable ?? true,
          preparationTimeMinutes: item.prep_time || item.preparationTimeMinutes || 10,
          isVegetarian: item.is_vegetarian ?? item.isVegetarian ?? !item.name.toLowerCase().includes('chicken'),
          rating: item.rating || 4.7,
          calories: item.calories || '250 kcal',
          protein: item.protein || '8g protein',
          isPopular: item.is_popular ?? item.isPopular ?? true,
        }));
        if (mappedItems.length > 0) {
          return {
            success: true,
            data: mappedItems,
          };
        }
      }
      throw new Error('Empty menu array');
    } catch {
      // Fallback catalogue if backend endpoint returns empty array or fails
      return {
        success: true,
        data: [
          // --- BREAKFAST ---
          {
            id: 'bkt-1',
            name: 'Kanda Poha',
            description: 'Steamed flattened rice tempered with mustard seeds, curry leaves, roasted peanuts, & lemon.',
            priceInINR: 30,
            category: 'breakfast',
            imageUrl: '/images/food/poha.jpg',
            isAvailable: true,
            preparationTimeMinutes: 5,
            isVegetarian: true,
            rating: 4.7,
            calories: '180 kcal',
            protein: '4g protein',
            isPopular: true,
            isHealthy: true,
            isQuick: true,
            tags: ['Morning Special', 'Light Snack'],
          },
          {
            id: 'bkt-2',
            name: 'Rava Upma',
            description: 'Traditional semolina porridge cooked with green chillies, cashews, and fresh coriander.',
            priceInINR: 35,
            category: 'breakfast',
            imageUrl: '/images/food/upma.jpg',
            isAvailable: true,
            preparationTimeMinutes: 6,
            isVegetarian: true,
            rating: 4.5,
            calories: '210 kcal',
            protein: '5g protein',
            isHealthy: true,
            isQuick: true,
          },
          {
            id: 'bkt-3',
            name: 'Steamed Idli Sambar (4 Pcs)',
            description: 'Fluffy white rice cakes served with hot lentil sambar and fresh coconut chutney.',
            priceInINR: 50,
            category: 'breakfast',
            imageUrl: '/images/food/idli.jpg',
            isAvailable: true,
            preparationTimeMinutes: 7,
            isVegetarian: true,
            rating: 4.8,
            calories: '220 kcal',
            protein: '7g protein',
            isPopular: true,
            isHealthy: true,
            isQuick: true,
          },
          {
            id: 'bkt-4',
            name: 'Crispy Medu Vada (2 Pcs)',
            description: 'Golden fried lentil donuts crisp on the outside and soft inside, served with chutneys.',
            priceInINR: 55,
            category: 'breakfast',
            imageUrl: '/images/food/vada.jpg',
            isAvailable: true,
            preparationTimeMinutes: 8,
            isVegetarian: true,
            rating: 4.6,
            calories: '280 kcal',
            protein: '8g protein',
          },
          {
            id: 'bkt-5',
            name: 'Bombay Toast Sandwich',
            description: 'Double layer grilled sandwich with spiced potato mash, cucumber, beetroot, and mint chutney.',
            priceInINR: 60,
            category: 'breakfast',
            imageUrl: '/images/food/sandwich.jpg',
            isAvailable: true,
            preparationTimeMinutes: 8,
            isVegetarian: true,
            rating: 4.6,
            calories: '290 kcal',
            protein: '6g protein',
            isQuick: true,
          },
          {
            id: 'bkt-6',
            name: 'Double Egg Bread Omelette',
            description: 'Fluffy two-egg masala omelette folded inside butter-toasted white bread slices.',
            priceInINR: 50,
            category: 'breakfast',
            imageUrl: '/images/food/frankie.jpg',
            isAvailable: true,
            preparationTimeMinutes: 7,
            isVegetarian: false,
            rating: 4.7,
            calories: '320 kcal',
            protein: '14g protein',
            isPopular: true,
            isQuick: true,
          },
          {
            id: 'bkt-7',
            name: 'Punjabi Aloo Paratha (With Curd)',
            description: 'Whole wheat flatbread stuffed with spiced mashed potatoes, served with white butter & curd.',
            priceInINR: 65,
            category: 'breakfast',
            imageUrl: '/images/food/paratha.jpg',
            isAvailable: true,
            preparationTimeMinutes: 12,
            isVegetarian: true,
            rating: 4.9,
            calories: '380 kcal',
            protein: '9g protein',
            isPopular: true,
          },
          {
            id: 'bkt-8',
            name: 'Crispy Masala Dosa',
            description: 'Thin fermented crepe stuffed with spiced potato palya, served with coconut chutney & sambar.',
            priceInINR: 70,
            category: 'breakfast',
            imageUrl: '/images/food/dosa.jpg',
            isAvailable: true,
            preparationTimeMinutes: 10,
            isVegetarian: true,
            rating: 4.8,
            calories: '310 kcal',
            protein: '6g protein',
            isTrending: true,
          },

          // --- MAIN COURSE ---
          {
            id: 'mc-1',
            name: 'Deluxe Special Veg Thali',
            description: 'Paneer gravy, Dal Tadka, Seasonal Veg, 3 Butter Chapati, Jeera Rice, Sweet Gulab Jamun & Salad.',
            priceInINR: 160,
            category: 'main_course',
            imageUrl: '/images/food/thali.jpg',
            isAvailable: true,
            preparationTimeMinutes: 15,
            isVegetarian: true,
            rating: 4.9,
            calories: '650 kcal',
            protein: '22g protein',
            isSpecial: true,
            isPopular: true,
            tags: ['Full Meal', 'Chef Choice'],
          },
          {
            id: 'item-1',
            name: 'Paneer Butter Masala Combo',
            description: 'Served with 2 butter naans, jeera rice & mint chutney.',
            priceInINR: 140,
            category: 'main_course',
            imageUrl: '/images/food/paneer_masala.jpg',
            isAvailable: true,
            preparationTimeMinutes: 15,
            isVegetarian: true,
            rating: 4.8,
            calories: '520 kcal',
            protein: '18g protein',
            isSpecial: true,
            isTrending: true,
            isFavorite: true,
          },
          {
            id: 'mc-3',
            name: 'Yellow Dal Fry & Jeera Rice',
            description: 'Arhar dal tempered with garlic, cumin, ghee & red chillies served over fragrant cumin rice.',
            priceInINR: 110,
            category: 'main_course',
            imageUrl: '/images/food/thali.jpg',
            isAvailable: true,
            preparationTimeMinutes: 10,
            isVegetarian: true,
            rating: 4.6,
            calories: '410 kcal',
            protein: '14g protein',
            isHealthy: true,
          },
          {
            id: 'mc-4',
            name: 'Hyderabadi Veg Dum Biryani',
            description: 'Aromatic basmati rice cooked with marinated cottage cheese, vegetables, and saffron spices.',
            priceInINR: 130,
            category: 'main_course',
            imageUrl: '/images/food/biryani.jpg',
            isAvailable: true,
            preparationTimeMinutes: 15,
            isVegetarian: true,
            rating: 4.7,
            calories: '480 kcal',
            protein: '12g protein',
            isTrending: true,
          },
          {
            id: 'mc-5',
            name: 'Chicken Dum Biryani',
            description: 'Authentic slow-cooked layered rice with succulent bone-in chicken pieces, served with mirchi salan.',
            priceInINR: 170,
            category: 'main_course',
            imageUrl: '/images/food/biryani.jpg',
            isAvailable: true,
            preparationTimeMinutes: 15,
            isVegetarian: false,
            rating: 4.9,
            calories: '590 kcal',
            protein: '32g protein',
            isPopular: true,
            isTrending: true,
          },
          {
            id: 'mc-6',
            name: 'Delhi Style Butter Chicken & Naan',
            description: 'Tender chicken tikka simmered in rich creamy tomato butter gravy, served with 2 Naans.',
            priceInINR: 180,
            category: 'main_course',
            imageUrl: '/images/food/paneer_masala.jpg',
            isAvailable: true,
            preparationTimeMinutes: 15,
            isVegetarian: false,
            rating: 4.9,
            calories: '640 kcal',
            protein: '34g protein',
            isSpecial: true,
          },
          {
            id: 'mc-7',
            name: 'Homestyle Chicken Curry Meal',
            description: 'Rustic onion tomato chicken gravy served with steamed basmati rice or rotis.',
            priceInINR: 150,
            category: 'main_course',
            imageUrl: '/images/food/paneer_masala.jpg',
            isAvailable: true,
            preparationTimeMinutes: 12,
            isVegetarian: false,
            rating: 4.7,
            calories: '510 kcal',
            protein: '28g protein',
          },
          {
            id: 'mc-8',
            name: 'Spicy Egg Curry (2 Eggs)',
            description: 'Hard boiled eggs simmered in rich maharashtrian style spicy masala gravy.',
            priceInINR: 100,
            category: 'main_course',
            imageUrl: '/images/food/frankie.jpg',
            isAvailable: true,
            preparationTimeMinutes: 10,
            isVegetarian: false,
            rating: 4.6,
            calories: '380 kcal',
            protein: '18g protein',
          },

          // --- FAST FOOD ---
          {
            id: 'ff-1',
            name: 'Crispy Veg Cheese Burger',
            description: 'Golden potato patty topped with cheese slice, onion rings, tomatoes & herb mayo sauce.',
            priceInINR: 75,
            category: 'fast_food',
            imageUrl: '/images/food/burger.jpg',
            isAvailable: true,
            preparationTimeMinutes: 10,
            isVegetarian: true,
            rating: 4.6,
            calories: '340 kcal',
            protein: '8g protein',
            isPopular: true,
            isQuick: true,
          },
          {
            id: 'ff-2',
            name: 'Crispy Chicken Zinger Burger',
            description: 'Juicy deep fried fried chicken breast fillet inside soft sesame bun with spicy mayonnaise.',
            priceInINR: 110,
            category: 'fast_food',
            imageUrl: '/images/food/burger.jpg',
            isAvailable: true,
            preparationTimeMinutes: 12,
            isVegetarian: false,
            rating: 4.8,
            calories: '460 kcal',
            protein: '24g protein',
            isTrending: true,
          },
          {
            id: 'ff-3',
            name: 'Farmhouse Veg Pizza (7 Inch)',
            description: 'Hand tossed thin crust topped with capsicum, sweet corn, mushrooms, & melted mozzarella.',
            priceInINR: 140,
            category: 'fast_food',
            imageUrl: '/images/food/pizza.jpg',
            isAvailable: true,
            preparationTimeMinutes: 15,
            isVegetarian: true,
            rating: 4.7,
            calories: '550 kcal',
            protein: '16g protein',
          },
          {
            id: 'ff-4',
            name: 'Chicken BBQ Pizza (7 Inch)',
            description: 'Loaded with smoky BBQ chicken chunks, red onions, jalapenos, and mozzarella cheese.',
            priceInINR: 170,
            category: 'fast_food',
            imageUrl: '/images/food/pizza.jpg',
            isAvailable: true,
            preparationTimeMinutes: 15,
            isVegetarian: false,
            rating: 4.8,
            calories: '610 kcal',
            protein: '28g protein',
          },
          {
            id: 'ff-5',
            name: 'Peri Peri Salted French Fries',
            description: 'Crispy golden potato fries tossed in fiery African peri peri seasoning, served with dip.',
            priceInINR: 65,
            category: 'fast_food',
            imageUrl: '/images/food/sandwich.jpg',
            isAvailable: true,
            preparationTimeMinutes: 7,
            isVegetarian: true,
            rating: 4.6,
            calories: '280 kcal',
            protein: '4g protein',
            isQuick: true,
          },
          {
            id: 'ff-6',
            name: 'Steamed Veg Momos (6 Pcs)',
            description: 'Tibetan style steamed dumplings filled with finely chopped cabbage & carrots, served with red chilli dip.',
            priceInINR: 70,
            category: 'fast_food',
            imageUrl: '/images/food/idli.jpg',
            isAvailable: true,
            preparationTimeMinutes: 10,
            isVegetarian: true,
            rating: 4.7,
            calories: '210 kcal',
            protein: '6g protein',
            isPopular: true,
          },
          {
            id: 'ff-7',
            name: 'Steamed Chicken Momos (6 Pcs)',
            description: 'Steamed dumplings packed with juicy minced chicken & herbs, with spicy garlic sauce.',
            priceInINR: 90,
            category: 'fast_food',
            imageUrl: '/images/food/idli.jpg',
            isAvailable: true,
            preparationTimeMinutes: 10,
            isVegetarian: false,
            rating: 4.9,
            calories: '260 kcal',
            protein: '16g protein',
            isTrending: true,
          },
          {
            id: 'ff-8',
            name: 'Hakka Veg Noodles',
            description: 'Wok tossed noodles with crunchy capsicum, cabbage, spring onion & soy garlic sauce.',
            priceInINR: 85,
            category: 'fast_food',
            imageUrl: '/images/food/noodles.jpg',
            isAvailable: true,
            preparationTimeMinutes: 10,
            isVegetarian: true,
            rating: 4.6,
            calories: '380 kcal',
            protein: '8g protein',
          },
          {
            id: 'ff-9',
            name: 'Schezwan Egg Fried Rice',
            description: 'High flame fried rice with scrambled eggs, veggies, and fiery Schezwan chilli oil.',
            priceInINR: 95,
            category: 'fast_food',
            imageUrl: '/images/food/biryani.jpg',
            isAvailable: true,
            preparationTimeMinutes: 10,
            isVegetarian: false,
            rating: 4.7,
            calories: '420 kcal',
            protein: '14g protein',
          },

          // --- SNACKS ---
          {
            id: 'item-5',
            name: 'Samosa Pav (Set of 2)',
            description: 'Crispy hot potato samosas inside butter toasted pav with garlic chutney.',
            priceInINR: 35,
            category: 'snacks',
            imageUrl: '/images/food/samosa_pav.jpg',
            isAvailable: true,
            preparationTimeMinutes: 5,
            isVegetarian: true,
            rating: 4.5,
            calories: '310 kcal',
            protein: '6g protein',
            isFavorite: true,
            isQuick: true,
          },
          {
            id: 'item-2',
            name: 'Classic Veg Cheese Grill Sandwich',
            description: 'Loaded with capsicum, tomatoes, sweet corn, and mozzarella cheese.',
            priceInINR: 70,
            category: 'snacks',
            imageUrl: '/images/food/cheese_sandwich.jpg',
            isAvailable: true,
            preparationTimeMinutes: 10,
            isVegetarian: true,
            rating: 4.6,
            calories: '340 kcal',
            protein: '9g protein',
            isTrending: true,
          },
          {
            id: 'snk-3',
            name: 'Pyaz Kachori (Set of 2)',
            description: 'Crispy deep fried pastry filled with spiced onion mixture, served with sweet tamarind chutney.',
            priceInINR: 40,
            category: 'snacks',
            imageUrl: '/images/food/vada.jpg',
            isAvailable: true,
            preparationTimeMinutes: 5,
            isVegetarian: true,
            rating: 4.5,
            calories: '290 kcal',
            protein: '5g protein',
            isQuick: true,
          },
          {
            id: 'snk-4',
            name: 'Crispy Veg Spring Rolls',
            description: 'Golden fried thin pastry rolls packed with wok-tossed vegetables, served with sweet chilli dip.',
            priceInINR: 80,
            category: 'snacks',
            imageUrl: '/images/food/frankie.jpg',
            isAvailable: true,
            preparationTimeMinutes: 10,
            isVegetarian: true,
            rating: 4.7,
            calories: '260 kcal',
            protein: '5g protein',
          },
          {
            id: 'snk-5',
            name: 'Cheese Garlic Bread Toast',
            description: 'Toasted French baguette slices spread with garlic butter & topped with bubbly mozzarella cheese.',
            priceInINR: 85,
            category: 'snacks',
            imageUrl: '/images/food/sandwich.jpg',
            isAvailable: true,
            preparationTimeMinutes: 8,
            isVegetarian: true,
            rating: 4.8,
            calories: '330 kcal',
            protein: '10g protein',
            isPopular: true,
          },
          {
            id: 'item-4',
            name: 'Chicken Frankie Roll',
            description: 'Spiced shredded chicken wrapped in whole wheat egg paratha.',
            priceInINR: 90,
            category: 'snacks',
            imageUrl: '/images/food/chicken_frankie.jpg',
            isAvailable: true,
            preparationTimeMinutes: 12,
            isVegetarian: false,
            rating: 4.7,
            calories: '410 kcal',
            protein: '22g protein',
            isTrending: true,
          },
          {
            id: 'snk-7',
            name: 'Crispy Cheese Corn Balls (6 Pcs)',
            description: 'Melted cheese and sweet corn coated in crispy breadcrumbs, fried golden brown.',
            priceInINR: 75,
            category: 'snacks',
            imageUrl: '/images/food/vada.jpg',
            isAvailable: true,
            preparationTimeMinutes: 8,
            isVegetarian: true,
            rating: 4.6,
            calories: '310 kcal',
            protein: '7g protein',
            isNew: true,
          },
          {
            id: 'snk-8',
            name: 'Indo-Chinese Chilli Paneer Dry',
            description: 'Wok tossed cottage cheese cubes with bell peppers, garlic, and soy schezwan sauce.',
            priceInINR: 110,
            category: 'snacks',
            imageUrl: '/images/food/paneer_masala.jpg',
            isAvailable: true,
            preparationTimeMinutes: 10,
            isVegetarian: true,
            rating: 4.8,
            calories: '370 kcal',
            protein: '16g protein',
            isPopular: true,
          },

          // --- BEVERAGES ---
          {
            id: 'bev-1',
            name: 'Kulhad Masala Chai',
            description: 'Brewed black tea with ginger, cardamom, and fresh milk served in earthen clay cup.',
            priceInINR: 20,
            category: 'beverages',
            imageUrl: '/images/food/tea.jpg',
            isAvailable: true,
            preparationTimeMinutes: 3,
            isVegetarian: true,
            rating: 4.9,
            calories: '90 kcal',
            protein: '3g protein',
            isPopular: true,
            isQuick: true,
            tags: ['Campus Favorite'],
          },
          {
            id: 'bev-2',
            name: 'Filter Coffee',
            description: 'South Indian style decoction coffee frothed with hot boiled milk.',
            priceInINR: 30,
            category: 'beverages',
            imageUrl: '/images/food/cold_coffee.jpg',
            isAvailable: true,
            preparationTimeMinutes: 4,
            isVegetarian: true,
            rating: 4.8,
            calories: '110 kcal',
            protein: '4g protein',
            isQuick: true,
          },
          {
            id: 'item-3',
            name: 'Cold Coffee with Ice Cream',
            description: 'Rich thick blended espresso with vanilla scoop.',
            priceInINR: 60,
            category: 'beverages',
            imageUrl: '/images/food/cold_coffee.jpg',
            isAvailable: true,
            preparationTimeMinutes: 5,
            isVegetarian: true,
            rating: 4.9,
            calories: '280 kcal',
            protein: '6g protein',
            isTrending: true,
            isFavorite: true,
            isQuick: true,
          },
          {
            id: 'bev-4',
            name: 'Fresh Mint Lime Soda',
            description: 'Refreshing fizzy soda infused with fresh lime juice, crushed mint leaves, and rock salt.',
            priceInINR: 40,
            category: 'beverages',
            imageUrl: '/images/food/juice.jpg',
            isAvailable: true,
            preparationTimeMinutes: 3,
            isVegetarian: true,
            rating: 4.7,
            calories: '80 kcal',
            protein: '0g protein',
            isHealthy: true,
            isQuick: true,
          },
          {
            id: 'bev-5',
            name: 'Oreo Chocolate Milkshake',
            description: 'Thick creamy milkshake blended with Oreo cookies, chocolate sauce, and topped with whipped cream.',
            priceInINR: 80,
            category: 'beverages',
            imageUrl: '/images/food/shake.jpg',
            isAvailable: true,
            preparationTimeMinutes: 5,
            isVegetarian: true,
            rating: 4.9,
            calories: '390 kcal',
            protein: '7g protein',
            isPopular: true,
          },

          // --- DESSERTS ---
          {
            id: 'des-1',
            name: 'Hot Gulab Jamun (2 Pcs)',
            description: 'Soft fried milk dough balls soaked in aromatic cardamom sugar syrup.',
            priceInINR: 40,
            category: 'desserts',
            imageUrl: '/images/food/brownie.jpg',
            isAvailable: true,
            preparationTimeMinutes: 3,
            isVegetarian: true,
            rating: 4.8,
            calories: '260 kcal',
            protein: '4g protein',
            isQuick: true,
          },
          {
            id: 'des-2',
            name: 'Vanilla Bean Ice Cream Scoop',
            description: 'Classic rich vanilla ice cream scoop topped with chocolate sprinkles.',
            priceInINR: 35,
            category: 'desserts',
            imageUrl: '/images/food/ice_cream.jpg',
            isAvailable: true,
            preparationTimeMinutes: 2,
            isVegetarian: true,
            rating: 4.6,
            calories: '160 kcal',
            protein: '3g protein',
            isQuick: true,
          },
          {
            id: 'item-6',
            name: 'Chocolate Brownie Sundae',
            description: 'Warm fudgy brownie topped with hot chocolate fudge & vanilla ice cream.',
            priceInINR: 85,
            category: 'desserts',
            imageUrl: '/images/food/brownie_sundae.jpg',
            isAvailable: true,
            preparationTimeMinutes: 5,
            isVegetarian: true,
            rating: 4.9,
            calories: '420 kcal',
            protein: '6g protein',
            isSpecial: true,
            isPopular: true,
          },
          {
            id: 'des-4',
            name: 'Belgian Dark Chocolate Pastry',
            description: 'Moist multi-layered chocolate sponge cake with rich Belgian ganache frosting.',
            priceInINR: 75,
            category: 'desserts',
            imageUrl: '/images/food/brownie.jpg',
            isAvailable: true,
            preparationTimeMinutes: 3,
            isVegetarian: true,
            rating: 4.8,
            calories: '340 kcal',
            protein: '5g protein',
            isNew: true,
          },
          {
            id: 'des-5',
            name: 'Fresh Bengali Rasgulla (2 Pcs)',
            description: 'Spongy cottage cheese balls soaked in light refined cardamom sugar syrup.',
            priceInINR: 45,
            category: 'desserts',
            imageUrl: '/images/menu/default-food.jpg',
            isAvailable: true,
            preparationTimeMinutes: 2,
            isVegetarian: true,
            rating: 4.7,
            calories: '210 kcal',
            protein: '5g protein',
            isHealthy: true,
            isQuick: true,
          },
          {
            id: 'des-6',
            name: 'Warm Choco Lava Cake',
            description: 'Gooey chocolate cake with molten liquid dark chocolate center.',
            priceInINR: 80,
            category: 'desserts',
            imageUrl: '/images/menu/default-food.jpg',
            isAvailable: true,
            preparationTimeMinutes: 5,
            isVegetarian: true,
            rating: 4.9,
            calories: '360 kcal',
            protein: '6g protein',
            isPopular: true,
          },
        ],
      };
    }
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const menuRes = await this.getMenu();
      if (menuRes.data) {
        const uniqueCategories = Array.from(new Set(menuRes.data.map((m) => m.category)));
        const catList: Category[] = uniqueCategories.map((cat, i) => ({
          id: `cat-${i + 1}`,
          name: cat.replace(/_/g, ' ').toUpperCase(),
          slug: cat,
          iconName: 'Utensils',
          itemCount: menuRes.data.filter((m) => m.category === cat).length,
        }));
        if (catList.length > 0) {
          return { success: true, data: catList };
        }
      }
    } catch {}
    return {
      success: true,
      data: FOOD_CATEGORIES,
    };
  }

  async getActiveOrder(): Promise<ApiResponse<StudentOrder | null>> {
    try {
      const response = await apiClient.get<any>('/orders');
      const orders = response.data?.data || response.data || [];
      if (Array.isArray(orders) && orders.length > 0) {
        const active = orders.find((o: any) =>
          ['PENDING', 'PENDING_PAYMENT', 'ACCEPTED', 'SENT_TO_KITCHEN', 'PREPARING', 'READY'].includes(o.status)
        );
        if (active) {
          const mappedOrder: StudentOrder = {
            id: active.order_id || active.id,
            orderNumber: `CB-${active.token_number || active.id.substring(0, 4)}`,
            tokenNumber: String(active.token_number || '01').padStart(2, '0'),
            studentId: active.student_id || 'std-user-1',
            studentName: active.student_name || 'Campus Student',
            vendorName: 'Main Campus Food Court',
            items: (active.items || []).map((i: any) => ({
              itemId: i.menu_item_id || i.id,
              itemName: i.menu_name || i.name || 'Food Item',
              quantity: i.quantity || 1,
              priceInINR: i.unit_price || i.price || 50,
            })),
            totalAmountInINR: active.total_amount || 100,
            status: active.status || 'PREPARING',
            pickupSlot: 'Instant Pickup',
            paymentMethod: 'UPI',
            estimatedPreparationTimeMinutes: active.estimated_wait_minutes || 10,
            createdAt: active.created_at || new Date().toISOString(),
            queuePosition: 2,
            pickupCounter: 'Counter A',
          };
          return { success: true, data: mappedOrder };
        }
      }
    } catch {}
    return {
      success: true,
      data: {
        id: 'ord-101',
        orderNumber: 'CB-8492',
        tokenNumber: '27',
        studentId: 'std-user-1',
        studentName: 'Anshika Sharma',
        vendorName: 'Main Campus Food Court',
        items: [
          { itemId: 'item-1', itemName: 'Paneer Butter Masala Combo', quantity: 1, priceInINR: 140 },
          { itemId: 'item-3', itemName: 'Cold Coffee with Ice Cream', quantity: 1, priceInINR: 60 },
        ],
        totalAmountInINR: 200,
        status: 'PREPARING',
        pickupSlot: 'Instant Pickup (10-15 mins)',
        paymentMethod: 'UPI',
        estimatedPreparationTimeMinutes: 8,
        createdAt: new Date().toISOString(),
        queuePosition: 3,
        pickupCounter: 'Counter A',
      },
    };
  }

  async getQueueStatus(orderId: string): Promise<ApiResponse<QueueStatus | null>> {
    try {
      const response = await apiClient.get<any>(`/orders/${orderId}`);
      const data = response.data?.data || response.data;
      if (data) {
        return {
          success: true,
          data: {
            orderId: data.order_id || orderId,
            orderNumber: `CB-${data.token_number || '8492'}`,
            tokenNumber: String(data.token_number || '27').padStart(2, '0'),
            currentStep: data.status === 'READY' ? 5 : 4,
            totalSteps: 6,
            statusText: `Order status: ${data.status || 'PREPARING'}`,
            estimatedWaitMinutes: data.estimated_wait_minutes || 8,
            queuePosition: 2,
            pickupCounter: 'Counter A',
          },
        };
      }
    } catch {}
    return {
      success: true,
      data: {
        orderId,
        orderNumber: 'CB-8492',
        tokenNumber: '27',
        currentStep: 4,
        totalSteps: 6,
        statusText: 'Kitchen is preparing your meal',
        estimatedWaitMinutes: 8,
        queuePosition: 3,
        pickupCounter: 'Counter A',
      },
    };
  }

  async placeOrder(payload: PlaceOrderPayload): Promise<ApiResponse<StudentOrder>> {
    try {
      const reqBody = {
        items: payload.items.map((i) => ({
          menu_item_id: i.menuItem.id,
          quantity: i.quantity,
        })),
        payment_method: payload.paymentMethod || 'UPI',
      };
      const response = await apiClient.post<any>('/orders', reqBody);
      const resData = response.data?.data || response.data;
      const totalInINR =
        resData?.total_amount ||
        payload.items.reduce((acc, item) => acc + item.menuItem.priceInINR * item.quantity, 0);

      const createdOrder: StudentOrder = {
        id: resData?.order_id || resData?.id || `ord-${Date.now()}`,
        orderNumber: `CB-${resData?.token_number || Math.floor(1000 + Math.random() * 9000)}`,
        tokenNumber: String(resData?.token_number || Math.floor(1 + Math.random() * 99)).padStart(2, '0'),
        studentId: 'std-user-1',
        studentName: 'Anshika Sharma',
        vendorName: 'Main Campus Food Court',
        items: payload.items.map((i) => ({
          itemId: i.menuItem.id,
          itemName: i.menuItem.name,
          quantity: i.quantity,
          priceInINR: i.menuItem.priceInINR,
          customization: i.customization,
        })),
        totalAmountInINR: totalInINR,
        status: resData?.status || 'PENDING',
        pickupSlot: payload.pickupSlot,
        paymentMethod: payload.paymentMethod,
        estimatedPreparationTimeMinutes: resData?.estimated_wait_minutes || 12,
        createdAt: resData?.created_at || new Date().toISOString(),
        queuePosition: 4,
        pickupCounter: 'Counter A',
      };

      return {
        success: true,
        message: 'Order placed successfully!',
        data: createdOrder,
      };
    } catch {
      const totalInINR = payload.items.reduce((acc, item) => acc + item.menuItem.priceInINR * item.quantity, 0);
      const newOrder: StudentOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `CB-${Math.floor(1000 + Math.random() * 9000)}`,
        tokenNumber: String(Math.floor(1 + Math.random() * 99)).padStart(2, '0'),
        studentId: 'std-user-1',
        studentName: 'Anshika Sharma',
        vendorName: 'Main Campus Food Court',
        items: payload.items.map((i) => ({
          itemId: i.menuItem.id,
          itemName: i.menuItem.name,
          quantity: i.quantity,
          priceInINR: i.menuItem.priceInINR,
          customization: i.customization,
        })),
        totalAmountInINR: totalInINR,
        status: 'PENDING',
        pickupSlot: payload.pickupSlot,
        paymentMethod: payload.paymentMethod,
        estimatedPreparationTimeMinutes: 12,
        createdAt: new Date().toISOString(),
        queuePosition: 4,
        pickupCounter: 'Counter A',
      };

      return {
        success: true,
        message: 'Order placed successfully!',
        data: newOrder,
      };
    }
  }

  async getOrderHistory(): Promise<ApiResponse<StudentOrder[]>> {
    try {
      const response = await apiClient.get<any>('/orders');
      const orders = response.data?.data || response.data || [];
      if (Array.isArray(orders) && orders.length > 0) {
        const mappedOrders: StudentOrder[] = orders.map((o: any) => ({
          id: o.order_id || o.id,
          orderNumber: `CB-${o.token_number || '101'}`,
          tokenNumber: String(o.token_number || '01').padStart(2, '0'),
          studentId: o.student_id || 'std-user-1',
          studentName: o.student_name || 'Campus Student',
          vendorName: 'Main Campus Food Court',
          items: (o.items || []).map((i: any) => ({
            itemId: i.menu_item_id || i.id,
            itemName: i.menu_name || i.name || 'Food Item',
            quantity: i.quantity || 1,
            priceInINR: i.unit_price || i.price || 50,
          })),
          totalAmountInINR: o.total_amount || 100,
          status: o.status || 'COLLECTED',
          pickupSlot: 'Completed Order',
          paymentMethod: 'UPI',
          estimatedPreparationTimeMinutes: 0,
          createdAt: o.created_at || new Date().toISOString(),
          rating: 5,
        }));
        return { success: true, data: mappedOrders };
      }
    } catch {}
    return {
      success: true,
      data: [
        {
          id: 'ord-99',
          orderNumber: 'CB-7321',
          tokenNumber: '15',
          studentId: 'std-user-1',
          studentName: 'Anshika Sharma',
          vendorName: 'Main Campus Food Court',
          items: [
            { itemId: 'item-2', itemName: 'Classic Veg Cheese Grill Sandwich', quantity: 2, priceInINR: 70 },
            { itemId: 'item-3', itemName: 'Cold Coffee with Ice Cream', quantity: 1, priceInINR: 60 },
          ],
          totalAmountInINR: 200,
          status: 'COLLECTED',
          pickupSlot: 'Yesterday, 01:15 PM',
          paymentMethod: 'CANTEEN_CARD',
          estimatedPreparationTimeMinutes: 0,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          rating: 5,
        },
      ],
    };
  }

  async reorder(orderId: string): Promise<ApiResponse<StudentOrder>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/student/orders/:orderId/reorder
      const response = await apiClient.post<ApiResponse<StudentOrder>>(`/v1/student/orders/${orderId}/reorder`);
      return response.data;
    } catch {
      const history = await this.getOrderHistory();
      const target = history.data.find((o) => o.id === orderId) || history.data[0];
      return {
        success: true,
        message: 'Order placed again successfully!',
        data: {
          ...target,
          id: `ord-${Date.now()}`,
          orderNumber: `CB-${Math.floor(1000 + Math.random() * 9000)}`,
          tokenNumber: '29',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        },
      };
    }
  }

  async getPickupSlots(): Promise<ApiResponse<PickupSlot[]>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/student/pickup-slots
      const response = await apiClient.get<ApiResponse<PickupSlot[]>>('/v1/student/pickup-slots');
      return response.data;
    } catch {
      return {
        success: true,
        data: PICKUP_SLOTS,
      };
    }
  }

  async getStudentStats(): Promise<ApiResponse<StudentStats>> {
    try {
      const ordersRes = await this.getOrderHistory();
      const orders = ordersRes.data || [];
      return {
        success: true,
        data: {
          activeOrders: orders.filter((o) => ['PENDING', 'ACCEPTED', 'SENT_TO_KITCHEN', 'PREPARING', 'READY'].includes(o.status)).length,
          totalOrders: Math.max(orders.length, 1),
          ordersThisMonth: Math.max(orders.length, 1),
          moneySavedInINR: 120,
          waitTimeSavedMinutes: 45,
          rewardPoints: orders.length * 20,
          walletBalanceInINR: 500,
          favoriteCategory: 'Main Course',
          favoriteVendor: 'Main Campus Food Court',
        },
      };
    } catch {
      return {
        success: true,
        data: {
          activeOrders: 0,
          totalOrders: 1,
          ordersThisMonth: 1,
          moneySavedInINR: 50,
          waitTimeSavedMinutes: 15,
          rewardPoints: 20,
          walletBalanceInINR: 500,
          favoriteCategory: 'Beverage',
          favoriteVendor: 'Main Campus Food Court',
        },
      };
    }
  }

  async getRecommendedItems(): Promise<ApiResponse<MenuItem[]>> {
    const all = (await this.getMenu()).data;
    return {
      success: true,
      data: all.slice(0, 6),
    };
  }

  async getTrendingItems(): Promise<ApiResponse<MenuItem[]>> {
    try {
      const searchRes = await apiClient.get<any>('/menu/search?q=popular');
      const searchData = searchRes.data?.data || searchRes.data || [];
      if (Array.isArray(searchData) && searchData.length > 0) {
        const mappedItems: MenuItem[] = searchData.map((item: any) => ({
          id: item.id || `item-${Math.random()}`,
          name: item.name,
          description: item.description || 'Fresh canteen preparation',
          priceInINR: item.price || item.priceInINR || 50,
          category: (item.category || 'main_course').toLowerCase().replace(/\s+/g, '_'),
          imageUrl: item.image_url || getFoodImageByName(item.name),
          isAvailable: item.is_available ?? item.isAvailable ?? true,
          preparationTimeMinutes: item.prep_time || item.preparationTimeMinutes || 10,
          isVegetarian: true,
          rating: 4.8,
          isPopular: true,
        }));
        return { success: true, data: mappedItems };
      }
    } catch {}
    const all = (await this.getMenu()).data;
    return {
      success: true,
      data: all.slice(0, 4),
    };
  }

  async getNotifications(): Promise<ApiResponse<CanteenNotification[]>> {
    return {
      success: true,
      data: [
        {
          id: 'notif-1',
          title: 'Order Status Update',
          message: 'Kitchen is currently preparing your meal.',
          timestamp: '5 mins ago',
          type: 'order',
          isRead: false,
        },
      ],
    };
  }

  async getStudentAnalytics(): Promise<ApiResponse<StudentAnalytics>> {
    return {
      success: true,
      data: {
        monthlySpending: [
          { categoryName: 'Quick Snacks', amountInINR: 300, percentage: 40 },
          { categoryName: 'Full Meals', amountInINR: 450, percentage: 60 },
        ],
        mostOrderedCategory: 'Full Meals',
        favoriteVendor: 'Main Campus Food Court',
        weeklyActivity: [
          { day: 'Mon', ordersCount: 2 },
          { day: 'Tue', ordersCount: 1 },
          { day: 'Wed', ordersCount: 3 },
          { day: 'Thu', ordersCount: 2 },
          { day: 'Fri', ordersCount: 1 },
        ],
      },
    };
  }

  async toggleFavoriteItem(itemId: string): Promise<ApiResponse<{ isFavorite: boolean }>> {
    return {
      success: true,
      data: { isFavorite: true },
    };
  }
}
export const studentApiService = new StudentApiService();
