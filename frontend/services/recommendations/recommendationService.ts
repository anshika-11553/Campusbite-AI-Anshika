import { StudentOrder, MenuItem } from '@/types/student';
import {
  recommendationEngine,
  UserPreferenceProfile,
  RecommendedFoodItem,
} from './recommendationEngine';

export interface IRecommendationService {
  getUserProfile(orders: StudentOrder[]): UserPreferenceProfile;
  getPersonalizedSection(orders: StudentOrder[], menuItems: MenuItem[]): RecommendedFoodItem[];
  getTopPicksSection(orders: StudentOrder[], menuItems: MenuItem[]): RecommendedFoodItem[];
  getCompleteYourMeal(cartItems: MenuItem[], allItems: MenuItem[]): RecommendedFoodItem[];
  getTrendingToday(menuItems: MenuItem[]): RecommendedFoodItem[];
  getPeopleAlsoOrdered(cartItems: MenuItem[], allItems: MenuItem[]): RecommendedFoodItem[];
}

class RecommendationService implements IRecommendationService {
  /**
   * Learns from student order history to construct a UserPreferenceProfile
   */
  getUserProfile(orders: StudentOrder[]): UserPreferenceProfile {
    const favoriteCategories: Record<string, number> = {};
    const frequentlyOrderedIds: Record<string, number> = {};
    let totalSpend = 0;
    const lastOrderedItems: MenuItem[] = [];

    const nonCancelledOrders = orders.filter((o) => o.status !== 'CANCELLED');

    nonCancelledOrders.forEach((order) => {
      totalSpend += order.totalAmountInINR;

      order.items.forEach((item) => {
        frequentlyOrderedIds[item.itemId] = (frequentlyOrderedIds[item.itemId] || 0) + item.quantity;
      });
    });

    const averageSpendInINR =
      nonCancelledOrders.length > 0 ? Math.round(totalSpend / nonCancelledOrders.length) : 150;

    return {
      totalOrdersCount: nonCancelledOrders.length,
      favoriteCategories,
      frequentlyOrderedIds,
      lastOrderedItems,
      lastOrderDate: nonCancelledOrders[0]?.createdAt,
      averageSpendInINR,
      usualMealTimeSlot: 'afternoon',
    };
  }

  getPersonalizedSection(orders: StudentOrder[], menuItems: MenuItem[]): RecommendedFoodItem[] {
    const profile = this.getUserProfile(orders);
    return recommendationEngine.getPersonalizedRecommendations(menuItems, profile, 8);
  }

  getTopPicksSection(orders: StudentOrder[], menuItems: MenuItem[]): RecommendedFoodItem[] {
    const profile = this.getUserProfile(orders);
    return recommendationEngine.getTopPicks(menuItems, profile, 6);
  }

  getCompleteYourMeal(cartItems: MenuItem[], allItems: MenuItem[]): RecommendedFoodItem[] {
    return recommendationEngine.getComplementaryItems(cartItems, allItems, 4);
  }

  getTrendingToday(menuItems: MenuItem[]): RecommendedFoodItem[] {
    return recommendationEngine.getTrendingItems(menuItems, 10);
  }

  getPeopleAlsoOrdered(cartItems: MenuItem[], allItems: MenuItem[]): RecommendedFoodItem[] {
    return recommendationEngine.getPeopleAlsoOrdered(cartItems, allItems, 4);
  }
}

export const recommendationService = new RecommendationService();
