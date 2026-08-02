const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const ROLES = {
  STUDENT: "d9541cca-faee-4410-a83a-bf167661d247",
  VENDOR: "212e91e5-1e70-4b6d-a294-67ec0e7d439f",
  CHEF: "9e203580-6a05-42cf-a447-f13bd223e098",
  ADMIN: "378897f7-5593-478d-b96f-c8a48e2a1aff",
};

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  prep_time: number;
  is_available: boolean;
  image_url?: string;
  description?: string;
  order_count?: number;
  rating?: number;
}

export interface OrderItem {
  menu_item_id: string;
  menu_name?: string;
  category?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  prep_time?: number;
}

export interface Order {
  id: string;
  order_id?: string;
  token_number: number | null;
  token_code?: string | null;
  queue_position?: number | null;
  status: 'PLACED' | 'PENDING_PAYMENT' | 'PAID' | 'ACCEPTED' | 'IN_KITCHEN' | 'PREPARING' | 'READY' | 'COLLECTED' | 'COMPLETED' | 'CANCELLED';
  payment_status?: string;
  total_amount: number;
  estimated_wait_minutes: number;
  created_at: string;
  student_name?: string;
  student_email?: string;
  customer_name?: string;
  items?: OrderItem[];
  pickup_pin?: string;
}

export function formatTokenDisplay(tokenNumber: number | null | undefined, tokenCode?: string | null): string {
  if (tokenCode) return tokenCode;
  if (tokenNumber === null || tokenNumber === undefined) return "CB---";
  return `CB${String(tokenNumber).padStart(3, "0")}`;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  role_id: string;
  role_name?: string;
}

// Preloaded Instant 32 Food Items with Clean Food Photography
export const MOCK_MENU: MenuItem[] = [
  {
    id: "m1",
    name: "Crispy Paneer Butter Masala Roll",
    category: "Main Course",
    price: 120,
    prep_time: 10,
    is_available: true,
    description: "Grilled paneer tikka stuffed in whole wheat paratha with mint chutney and spicy onions.",
    order_count: 342,
    rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m2",
    name: "Special Campus Cheese Samosa (2 pcs)",
    category: "Snacks",
    price: 45,
    prep_time: 5,
    is_available: true,
    description: "Golden crispy samosas loaded with melted cheese, corn and spiced potatoes.",
    order_count: 890,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m3",
    name: "Cold Coffee with Ice Cream",
    category: "Beverages",
    price: 70,
    prep_time: 4,
    is_available: true,
    description: "Rich blended espresso with chilled milk and a scoop of dark chocolate ice cream.",
    order_count: 654,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m4",
    name: "Desi Veg Burger & Fries Combo",
    category: "Snacks",
    price: 110,
    prep_time: 8,
    is_available: true,
    description: "Herb spiced potato patty, fresh veggies, peri peri mayo with crispy fries.",
    order_count: 512,
    rating: 4.6,
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m5",
    name: "Chilli Garlic Noodles",
    category: "Main Course",
    price: 130,
    prep_time: 12,
    is_available: true,
    description: "Wok-tossed stir fry noodles with garlic, red chili paste, bell peppers and scallions.",
    order_count: 421,
    rating: 4.7,
    image_url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m6",
    name: "Masala Chai (Kullad)",
    category: "Beverages",
    price: 25,
    prep_time: 3,
    is_available: true,
    description: "Traditional ginger and cardamom infused milk tea served in an eco-friendly clay kullad.",
    order_count: 1240,
    rating: 5.0,
    image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m7",
    name: "South Indian Special Dosa",
    category: "Breakfast",
    price: 90,
    prep_time: 7,
    is_available: true,
    description: "Crispy rice crepe filled with seasoned potato masala, served with coconut chutney & sambar.",
    order_count: 310,
    rating: 4.7,
    image_url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m8",
    name: "Double Cheese Pizza (Personal)",
    category: "Snacks",
    price: 160,
    prep_time: 15,
    is_available: true,
    description: "7-inch hand tossed pizza loaded with mozzarella cheese, liquid cheddar & oregano.",
    order_count: 275,
    rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m9",
    name: "Amritsari Chole Bhature (2 Pcs)",
    category: "Breakfast",
    price: 110,
    prep_time: 10,
    is_available: true,
    description: "Fluffy golden fried bhature served with rich spiced chickpea curry and fried green chili.",
    order_count: 480,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m10",
    name: "Special Pav Bhaji (Butter Loaded)",
    category: "Main Course",
    price: 95,
    prep_time: 8,
    is_available: true,
    description: "Mashed vegetable curry topped with Amul butter, served with 2 toasted soft butter pavs.",
    order_count: 620,
    rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m11",
    name: "Hakka Noodles & Manchurian Combo",
    category: "Main Course",
    price: 150,
    prep_time: 12,
    is_available: true,
    description: "Wok tossed veg hakka noodles paired with spicy gravy vegetable manchurian balls.",
    order_count: 390,
    rating: 4.7,
    image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m12",
    name: "Chilled Mango Lassi",
    category: "Beverages",
    price: 60,
    prep_time: 4,
    is_available: true,
    description: "Thick sweet yogurt smoothie blended with ripe Alphonsos and saffron garnishing.",
    order_count: 430,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m13",
    name: "Hot Chocolate Fudge Sundae",
    category: "Desserts",
    price: 85,
    prep_time: 5,
    is_available: true,
    description: "Two scoops of vanilla ice cream smothered in warm fudge sauce and roasted cashew nuts.",
    order_count: 310,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m14",
    name: "Veg Grilled Club Sandwich",
    category: "Snacks",
    price: 85,
    prep_time: 6,
    is_available: true,
    description: "Triple-decker toasted bread filled with cucumber, tomato, cheese, potato & mint spread.",
    order_count: 540,
    rating: 4.6,
    image_url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m15",
    name: "Punjab Aloo Paratha with Curd",
    category: "Breakfast",
    price: 75,
    prep_time: 8,
    is_available: true,
    description: "Tandoori tawa paratha stuffed with spicy potatoes, served with fresh curd and white butter.",
    order_count: 720,
    rating: 4.8,
    image_url: "https://cookingfromheart.com/wp-content/uploads/2020/09/Aloo-Paratha-4.jpg"
  },
  {
    id: "m16",
    name: "Steamed Veg Momos (8 Pcs)",
    category: "Snacks",
    price: 80,
    prep_time: 7,
    is_available: true,
    description: "Delicate steamed dumplings stuffed with cabbage, carrot, garlic & fiery red chili chutney.",
    order_count: 810,
    rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m17",
    name: "Crispy Fried Paneer Momos",
    category: "Snacks",
    price: 110,
    prep_time: 9,
    is_available: true,
    description: "Deep fried golden momos filled with paneer and scallions, served with mayonnaise.",
    order_count: 670,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m18",
    name: "Cold Brew Iced Americano",
    category: "Beverages",
    price: 65,
    prep_time: 3,
    is_available: true,
    description: "12-hour steep cold brew coffee poured over ice cubes with a hint of caramel syrup.",
    order_count: 290,
    rating: 4.7,
    image_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m19",
    name: "Hot Gulab Jamun (2 Pcs)",
    category: "Desserts",
    price: 45,
    prep_time: 2,
    is_available: true,
    description: "Melt-in-mouth fried milk solids soaked in rose cardamom sugar syrup.",
    order_count: 510,
    rating: 4.9,
    image_url: "https://cdn.dotpe.in/longtail/store-items/1161396/YnhT6Gpo.webp"
  },
  {
    id: "m20",
    name: "Home Style Rajma Chawal Bowl",
    category: "Main Course",
    price: 100,
    prep_time: 6,
    is_available: true,
    description: "Slow-cooked red kidney bean curry served over steaming hot basmati rice & papad.",
    order_count: 940,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m21",
    name: "Kadhai Paneer & Butter Naan",
    category: "Main Course",
    price: 160,
    prep_time: 12,
    is_available: true,
    description: "Paneer cubes tossed in rich tomato-capsicum gravy, served with 2 tandoori butter naans.",
    order_count: 410,
    rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m22",
    name: "Nutella Chocolate Waffle",
    category: "Desserts",
    price: 120,
    prep_time: 8,
    is_available: true,
    description: "Fresh crispy Belgian waffle drenched in Nutella spread and dark chocolate sprinkles.",
    order_count: 360,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m23",
    name: "Crispy Veg Spring Rolls (4 Pcs)",
    category: "Snacks",
    price: 90,
    prep_time: 7,
    is_available: true,
    description: "Golden fried rolls stuffed with shredded vegetables and glass noodles with sweet chili dip.",
    order_count: 380,
    rating: 4.7,
    image_url: "https://d1mxd7n691o8sz.cloudfront.net/static/recipe/recipe/2023-12/Vegetable-Spring-Rolls-2-1-906001560ca545c8bc72baf473f230b4_thumbnail_170.jpeg"
  },
  {
    id: "m24",
    name: "Paneer Tikka Tandoori Platter",
    category: "Main Course",
    price: 175,
    prep_time: 14,
    is_available: true,
    description: "Clay oven roasted marinated cottage cheese cubes served with mint dip & laccha onion.",
    order_count: 290,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m25",
    name: "Crispy Peri Peri French Fries",
    category: "Snacks",
    price: 75,
    prep_time: 5,
    is_available: true,
    description: "Deep fried crinkle cut potatoes tossed in spicy African peri peri seasoning.",
    order_count: 840,
    rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m26",
    name: "Oreo Chocolate Milkshake",
    category: "Beverages",
    price: 80,
    prep_time: 4,
    is_available: true,
    description: "Creamy vanilla milk blended with crunchy Oreo cookies and topped with whipped cream.",
    order_count: 610,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m27",
    name: "Italian Penne Pasta in Pink Sauce",
    category: "Main Course",
    price: 140,
    prep_time: 12,
    is_available: true,
    description: "Penne pasta cooked in a blend of rich cream and tangy tomato marinara sauce.",
    order_count: 450,
    rating: 4.7,
    image_url: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "m28",
    name: "Sizzling Brownie with Vanilla",
    category: "Desserts",
    price: 130,
    prep_time: 6,
    is_available: true,
    description: "Fudgy chocolate brownie served sizzling hot on a iron skillet with vanilla ice cream.",
    order_count: 530,
    rating: 5.0,
    image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m29",
    name: "Cheese Garlic Bread Sticks (4 Pcs)",
    category: "Snacks",
    price: 95,
    prep_time: 8,
    is_available: true,
    description: "Freshly baked garlic breadsticks topped with herbs and melted mozzarella cheese.",
    order_count: 470,
    rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m30",
    name: "Special Dal Makhani & Jeera Rice",
    category: "Main Course",
    price: 125,
    prep_time: 8,
    is_available: true,
    description: "Slow simmered black lentils cooked overnight with cream & butter, served with fragrant cumin rice.",
    order_count: 880,
    rating: 4.9,
    image_url: "https://www.seriouseats.com/thmb/YU35m-1_WLqizQ3KWOPZcS9TyJ0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20241121-SEA-DalMakhani-QiAi-Hero3-39-72429e5e0db94e9990b5ea4121057e58.jpg"
  },
  {
    id: "m31",
    name: "Fresh Watermelon Juice (No Ice)",
    category: "Beverages",
    price: 50,
    prep_time: 3,
    is_available: true,
    description: "100% natural cold pressed watermelon juice garnished with fresh mint leaves.",
    order_count: 390,
    rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=350&auto=format&fit=crop&q=80"
  },
  {
    id: "m32",
    name: "Special Rasmalai (2 Pcs)",
    category: "Desserts",
    price: 70,
    prep_time: 2,
    is_available: true,
    description: "Soft cottage cheese patties soaked in chilled saffron and pistachio flavored milk.",
    order_count: 490,
    rating: 4.9,
    image_url: "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_960,w_960//InstamartAssets/Receipes/kesar_rasmalai.webp"
  }
];

// =========================================
// Helper to make authorized API calls
// =========================================
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("campusbite_token")
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  console.log("REQUEST BODY:", options.body);
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Backend Error:", response.status, data);
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}

// =========================================
// API
// =========================================
export const api = {

  // -------------------------
  // Register
  // -------------------------
  async register(full_name: string, email: string, password: string) {
    return await fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        full_name,
        email: email.trim().toLowerCase(),
        password,
      }),
    });
  },

  // -------------------------
  // Login
  // -------------------------
  async login(email: string, password: string) {
    return await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    });
  },

  // ================================
  // Menu API
  // ================================
  async getMenu(category?: string, query?: string) {
    let endpoint = "/menu";
    const params = new URLSearchParams();

    if (category && category !== "All") {
      params.append("category", category);
    }

    if (query) {
      params.append("q", query);
    }

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const res = await fetchAPI(endpoint);

    return Array.isArray(res.data) ? res.data : [];
  },
  // -------------------------
  // Place Order
  // -------------------------
  async placeOrder(
    items: { menu_item_id: string; quantity: number }[]
  ) {
    console.log("API received:", items);
    console.table(items);
    const res = await fetchAPI("/orders", {
      method: "POST",
      body: JSON.stringify({
        items,
      }),
    });
    if (res && res.data) {
      const orderId = res.data.id || res.data.order_id;
      res.data.id = orderId;
      res.data.order_id = orderId;
    }
    return res;
  },



  // ================================
  // Student Orders
  // ================================
  async getStudentOrders() {
    const res = await fetchAPI("/orders");

    // Backend returns { success, message, data }
    return Array.isArray(res.data) ? res.data : [];
  },

  // ================================
  // Update Order Status
  // ================================
  async updateOrderStatus(orderId: string, status: string, paymentMethod?: string) {
    return await fetchAPI(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        status,
        payment_method: paymentMethod,
      }),
    });
  },

  // ================================
  // Vendor Orders
  // ================================
  async getVendorOrders() {
    const res = await fetchAPI("/vendor/orders");

    return Array.isArray(res.data) ? res.data : [];
  },

  // ================================
  // Vendor Dashboard
  // ================================
  async getVendorDashboard() {
    return await fetchAPI("/vendor/dashboard");
  },

  // ================================
  // Popular Items
  // ================================
  async getPopularItems() {
    return await fetchAPI("/vendor/popular-items");
  },

  // ================================
  // Direct Payment Update (No Razorpay / No Verification Endpoint)
  // ================================
  async verifyPayment(
    orderId: string,
    paymentMethod: "UPI" | "CASH"
  ) {
    return await this.updateOrderStatus(orderId, "PAID", paymentMethod);
  },

  // ================================
  // Campus Intelligence Engine
  // ================================
  async getIntelligence() {
    try {
      const res = await fetchAPI("/analytics/intelligence");
      return res.data;
    } catch (e) {
      console.error("Failed to fetch intelligence metrics:", e);
      return null;
    }
  },

  // ================================
  // Role-Based AI Chatbot Query
  // ================================
  async askChatbot(query: string, roleId: string) {
    try {
      const res = await fetchAPI("/analytics/chatbot", {
        method: "POST",
        body: JSON.stringify({ query, roleId }),
      });
      return res.data?.answer || "I'm analyzing live operational data from Supabase.";
    } catch (e) {
      console.error("Chatbot query failed:", e);
      return "Connected to CampusBite AI Intelligence Engine.";
    }
  },

  // ================================
  // AI Smart Pickup Time Prediction
  // ================================
  async predictPickup(items: any[]) {
    try {
      const res = await fetchAPI("/analytics/predict-pickup", {
        method: "POST",
        body: JSON.stringify({ items }),
      });
      return res.data;
    } catch (e) {
      console.error("Pickup prediction failed:", e);
      return null;
    }
  },

  // ================================
  // AI Slot Optimization Engine
  // ================================
  async getSlotOptimization(date?: string) {
    try {
      const res = await fetchAPI("/analytics/slot-optimization", {
        method: "POST",
        body: JSON.stringify({ date }),
      });
      return res.data;
    } catch (e) {
      console.error("Slot optimization failed:", e);
      return null;
    }
  },

  // ================================
  // AI Kitchen Demand Forecast Engine
  // ================================
  async getVendorForecast(vendorId?: string) {
    try {
      const res = await fetchAPI("/analytics/vendor-forecast", {
        method: "POST",
        body: JSON.stringify({ vendorId }),
      });
      return res.data;
    } catch (e) {
      console.error("Vendor demand forecast failed:", e);
      return null;
    }
  },

  // ================================
  // AI Stall Recommendation Engine
  // ================================
  async getStallRecommendation(selectedStallId?: string, menuItemId?: string) {
    try {
      const res = await fetchAPI("/analytics/stall-recommendation", {
        method: "POST",
        body: JSON.stringify({ selectedStallId, menuItemId }),
      });
      return res.data;
    } catch (e) {
      console.error("Stall recommendation failed:", e);
      return null;
    }
  },

  // ================================
  // AI Campus Operations Brain Engine
  // ================================
  async getAdminOperationsBrain() {
    try {
      const res = await fetchAPI("/analytics/admin-brain", {
        method: "POST",
      });
      return res.data;
    } catch (e) {
      console.error("Admin brain report failed:", e);
      return null;
    }
  },

  // ================================
  // AI Arrival Assistant Engine
  // ================================
  async getArrivalPrediction(orderId?: string, stallId?: string) {
    try {
      const res = await fetchAPI("/analytics/arrival-prediction", {
        method: "POST",
        body: JSON.stringify({ orderId, stallId }),
      });
      return res.data;
    } catch (e) {
      console.error("Arrival prediction failed:", e);
      return null;
    }
  },

  // ================================
  // CampusSecure Pickup Verification
  // ================================
  async verifyPickupPin(orderId: string, pin: string) {
    const res = await fetchAPI(`/orders/${orderId}/verify-pickup-pin`, {
      method: "POST",
      body: JSON.stringify({ pin }),
    });
    return res;
  },

  async regeneratePickupPin(orderId: string) {
    const res = await fetchAPI(`/orders/${orderId}/regenerate-pickup-pin`, {
      method: "POST",
    });
    return res.data;
  },

  async getPickupPin(orderId: string) {
    try {
      const res = await fetchAPI(`/orders/${orderId}/pickup-pin`, {
        method: "GET",
      });
      return res.data;
    } catch (e) {
      return null;
    }
  }
};
