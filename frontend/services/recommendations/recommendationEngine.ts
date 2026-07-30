import { MenuItem } from '@/types/student';

export interface RecommendedFoodItem {
  item: MenuItem;
  score: number;
  badge: 'Recommended' | 'Trending' | 'Favorite' | 'Quick Pickup' | 'Healthy Choice' | 'Budget Friendly' | 'Popular';
  badgeIcon: string;
  reason: string;
}

export interface UserPreferenceProfile {
  totalOrdersCount: number;
  favoriteCategories: Record<string, number>; // e.g. { main_course: 5, fast_food: 8 }
  frequentlyOrderedIds: Record<string, number>; // e.g. { 'item-1': 4 }
  lastOrderedItems: MenuItem[];
  lastOrderDate?: string;
  averageSpendInINR: number;
  usualMealTimeSlot?: 'morning' | 'afternoon' | 'evening' | 'night';
}

export const SAMPLE_MENU_ITEMS: MenuItem[] = [
  {
    id: 'bkt-1',
    name: 'Kanda Poha',
    description: 'Steamed flattened rice tempered with mustard seeds, curry leaves, roasted peanuts, & lemon.',
    priceInINR: 30,
    category: 'breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTimeMinutes: 5,
    isVegetarian: true,
    rating: 4.7,
    calories: '180 kcal',
    protein: '4g protein',
    isPopular: true,
    isHealthy: true,
    isQuick: true,
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
  },
  {
    id: 'ff-1',
    name: 'Crispy Veg Cheese Burger',
    description: 'Golden potato patty topped with cheese slice, onion rings, tomatoes & herb mayo sauce.',
    priceInINR: 75,
    category: 'fast_food',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTimeMinutes: 10,
    isVegetarian: true,
    rating: 4.6,
    isPopular: true,
  },
  {
    id: 'ff-3',
    name: 'Farmhouse Veg Pizza (7 Inch)',
    description: 'Hand tossed thin crust topped with capsicum, sweet corn, mushrooms, & melted mozzarella.',
    priceInINR: 140,
    category: 'fast_food',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTimeMinutes: 15,
    isVegetarian: true,
    rating: 4.7,
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
    isTrending: true,
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
    isSpecial: true,
    isPopular: true,
  },
];

// Co-occurrence complementary pairing mapping for "Complete Your Meal"
const COMPLEMENTARY_PAIRS: Record<string, string[]> = {
  burger: ['snk-4', 'bev-1', 'des-2'], // Fries, Cold Drink, Brownie
  pizza: ['snk-5', 'bev-1', 'des-2'], // Garlic Bread, Coke, Dip
  pasta: ['snk-5', 'bev-2', 'des-1'], // Garlic Toast, Cold Coffee
  sandwich: ['snk-4', 'bev-3', 'des-3'], // French Fries, Fresh Juice
  dosa: ['bev-4', 'snk-1'], // Filter Coffee, Medu Vada
  biryani: ['bev-3', 'des-4'], // Lassi, Gulab Jamun
  frankie: ['bev-2', 'des-2'], // Cold Coffee, Brownie
};

export interface IRecommendationEngine {
  getPersonalizedRecommendations(
    menuItems: MenuItem[],
    profile: UserPreferenceProfile,
    limit?: number
  ): RecommendedFoodItem[];
  getComplementaryItems(cartItems: MenuItem[], allItems: MenuItem[], limit?: number): RecommendedFoodItem[];
  getTrendingItems(menuItems: MenuItem[], limit?: number): RecommendedFoodItem[];
  getTopPicks(menuItems: MenuItem[], profile: UserPreferenceProfile, limit?: number): RecommendedFoodItem[];
  getPeopleAlsoOrdered(cartItems: MenuItem[], allItems: MenuItem[], limit?: number): RecommendedFoodItem[];
}

class RecommendationEngine implements IRecommendationEngine {
  /**
   * Predicts and ranks personalized recommendations using user order history,
   * category affinity, spending budget, and time-of-day contextual heuristics.
   */
  getPersonalizedRecommendations(
    menuItems: MenuItem[],
    profile: UserPreferenceProfile,
    limit: number = 8
  ): RecommendedFoodItem[] {
    const currentHour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'afternoon';
    if (currentHour >= 6 && currentHour < 11) timeOfDay = 'morning';
    else if (currentHour >= 11 && currentHour < 16) timeOfDay = 'afternoon';
    else if (currentHour >= 16 && currentHour < 20) timeOfDay = 'evening';
    else timeOfDay = 'night';

    // Calculate score for each menu item
    const scoredList: RecommendedFoodItem[] = menuItems.map((item) => {
      let score = 50; // base score
      let badge: RecommendedFoodItem['badge'] = 'Recommended';
      let badgeIcon = '⭐';
      let reason = 'Popular among campus students';

      const orderFreq = profile.frequentlyOrderedIds[item.id] || 0;
      const categoryFreq = profile.favoriteCategories[item.category] || 0;

      // 1. Order Frequency Boost
      if (orderFreq > 0) {
        score += orderFreq * 25;
        badge = 'Favorite';
        badgeIcon = '❤️';
        reason = `Based on your ${orderFreq} previous order${orderFreq > 1 ? 's' : ''}`;
      }

      // 2. Favorite Category Affinity
      if (categoryFreq > 0) {
        score += categoryFreq * 10;
        if (orderFreq === 0) {
          badge = 'Recommended';
          badgeIcon = '⭐';
          reason = `Matches your preference for ${item.category.replace('_', ' ')}`;
        }
      }

      // 3. Time of Day Contextual Alignment
      if (timeOfDay === 'morning' && (item.category === 'breakfast' || item.category === 'beverages')) {
        score += 30;
        reason = 'Popular choice for Morning Breakfast';
        badge = 'Quick Pickup';
        badgeIcon = '⚡';
      } else if (timeOfDay === 'afternoon' && item.category === 'main_course') {
        score += 35;
        reason = 'Great pick for Afternoon Lunch';
      } else if (timeOfDay === 'evening' && (item.category === 'snacks' || item.category === 'beverages')) {
        score += 30;
        reason = 'Ideal for Evening Canteen Snacks';
        badge = 'Trending';
        badgeIcon = '🔥';
      } else if (timeOfDay === 'night' && item.category === 'desserts') {
        score += 25;
        reason = 'Popular Late-Night Dessert Craving';
      }

      // 4. Budget Preference
      if (profile.averageSpendInINR > 0 && item.priceInINR <= profile.averageSpendInINR * 0.7) {
        score += 15;
        if (orderFreq === 0) {
          badge = 'Budget Friendly';
          badgeIcon = '💰';
          reason = `Fits within your average ₹${Math.round(profile.averageSpendInINR)} budget`;
        }
      }

      // 5. High Rating / Popularity
      if (item.rating && item.rating >= 4.7) {
        score += 20;
      }
      if (item.isPopular) {
        score += 15;
      }
      if (item.isVegetarian) {
        score += 5;
      }

      return {
        item,
        score,
        badge,
        badgeIcon,
        reason,
      };
    });

    // Sort descending by score
    scoredList.sort((a, b) => b.score - a.score);
    return scoredList.slice(0, limit);
  }

  /**
   * "Complete Your Meal" - Finds complementary pairing options (e.g. Burger -> Fries + Drink).
   */
  getComplementaryItems(cartItems: MenuItem[], allItems: MenuItem[], limit: number = 4): RecommendedFoodItem[] {
    if (cartItems.length === 0) {
      return this.getTrendingItems(allItems, limit);
    }

    const recommendedIds = new Set<string>();

    cartItems.forEach((cartItem) => {
      const lowerName = cartItem.name.toLowerCase();
      Object.keys(COMPLEMENTARY_PAIRS).forEach((key) => {
        if (lowerName.includes(key)) {
          COMPLEMENTARY_PAIRS[key].forEach((id) => recommendedIds.add(id));
        }
      });
    });

    let matches = allItems.filter((item) => recommendedIds.has(item.id) && !cartItems.some((c) => c.id === item.id));

    // Fallback if no exact pair rule matches
    if (matches.length === 0) {
      matches = allItems.filter(
        (item) => (item.category === 'beverages' || item.category === 'desserts' || item.category === 'snacks') && !cartItems.some((c) => c.id === item.id)
      );
    }

    return matches.slice(0, limit).map((item) => ({
      item,
      score: 90,
      badge: 'Popular',
      badgeIcon: '👥',
      reason: `Frequently bought together with ${cartItems[0]?.name || 'your items'}`,
    }));
  }

  /**
   * Top 10 Trending Campus Bestsellers
   */
  getTrendingItems(menuItems: MenuItem[], limit: number = 10): RecommendedFoodItem[] {
    return menuItems
      .filter((item) => item.isPopular || (item.rating && item.rating >= 4.6))
      .slice(0, limit)
      .map((item) => ({
        item,
        score: (item.rating || 4.5) * 20,
        badge: 'Trending',
        badgeIcon: '🔥',
        reason: 'Trending Today across Campus Canteen',
      }));
  }

  /**
   * "Top Picks For You" - Highest personalized scoring items
   */
  getTopPicks(menuItems: MenuItem[], profile: UserPreferenceProfile, limit: number = 6): RecommendedFoodItem[] {
    return this.getPersonalizedRecommendations(menuItems, profile, limit);
  }

  /**
   * Collaborative Filtering Simulation ("People Like You Also Ordered")
   */
  getPeopleAlsoOrdered(cartItems: MenuItem[], allItems: MenuItem[], limit: number = 4): RecommendedFoodItem[] {
    const cartCategory = cartItems[0]?.category || 'snacks';
    const suggested = allItems.filter(
      (item) => item.category !== cartCategory && (item.category === 'beverages' || item.category === 'desserts')
    );

    return suggested.slice(0, limit).map((item) => ({
      item,
      score: 85,
      badge: 'Popular',
      badgeIcon: '👥',
      reason: 'Students with similar tastes also ordered this item',
    }));
  }
}

export const recommendationEngine = new RecommendationEngine();
