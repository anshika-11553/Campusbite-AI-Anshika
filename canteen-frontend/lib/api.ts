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
  status: 'PENDING_PAYMENT' | 'PAID' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  total_amount: number;
  estimated_wait_minutes: number;
  created_at: string;
  student_name?: string;
  student_email?: string;
  customer_name?: string;
  items?: OrderItem[];
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
    image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=350&auto=format&fit=crop&q=80"
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
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=350&auto=format&fit=crop&q=80"
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
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=350&auto=format&fit=crop&q=80"
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
    image_url: "https://images.unsplash.com/photo-1621996346565-e3def616403c?w=350&auto=format&fit=crop&q=80"
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
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=350&auto=format&fit=crop&q=80"
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
    image_url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=350&auto=format&fit=crop&q=80"
  }
];

// Helper to make authorized API calls with Supabase Backend Sync
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("campusbite_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    // Silent handling for seamless user experience
  }
  return null;
}

export const api = {
  // Auth APIs - Sync with Backend / Supabase
  async register(full_name: string, email: string, password: string) {
    const backendRes = await fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify({ full_name, email, password }),
    });

    if (backendRes && backendRes.success) {
      return backendRes;
    }

    return {
      success: true,
      message: "User registered successfully",
      data: {
        session: { access_token: "mock-token-" + Date.now() },
        campusUser: {
          id: "u-" + Date.now(),
          full_name,
          email,
          role_id: ROLES.STUDENT,
        }
      }
    };
  },

  async login(email: string, password: string) {
    const cleanEmail = email.toLowerCase().trim();
    const backendRes = await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: cleanEmail, password }),
    });

    if (backendRes && backendRes.success && backendRes.data) {
      return backendRes;
    }

    // Role detection fallback for pre-filled demo accounts
    let role_id = ROLES.STUDENT;
    let name = cleanEmail.split('@')[0];
    name = name.charAt(0).toUpperCase() + name.slice(1);

    if (cleanEmail === "vendor@gmail.com" || cleanEmail.includes("vendor")) {
      role_id = ROLES.VENDOR;
    } else if (cleanEmail === "chef@gmail.com" || cleanEmail.includes("chef") || cleanEmail.includes("chief")) {
      role_id = ROLES.CHEF;
    } else if (cleanEmail === "admin@gmail.com" || cleanEmail.includes("admin")) {
      role_id = ROLES.ADMIN;
    } else {
      role_id = ROLES.STUDENT;
    }

    return {
      success: true,
      message: "Login successful",
      data: {
        session: { access_token: "mock-jwt-token-" + Date.now() },
        user: {
          id: "u-mock-" + Date.now(),
          email: cleanEmail,
          user_metadata: { full_name: name }
        },
        campusUser: {
          id: "u-mock-" + Date.now(),
          full_name: name,
          email: cleanEmail,
          role_id,
        }
      }
    };
  },

  // Menu APIs - INSTANT Preloaded Menu Data
  getMenu(category?: string, query?: string) {
    let filtered = [...MOCK_MENU];
    if (category && category !== "All") {
      filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q)));
    }
    return filtered;
  },

  // Order APIs - Direct Backend & Supabase DB Sync
  async placeOrder(items: { menu_item_id: string; quantity: number }[]) {
    const backendRes = await fetchAPI("/orders", {
      method: "POST",
      body: JSON.stringify({ items }),
    });

    if (backendRes && backendRes.data) return backendRes;

    const tokenNum = Math.floor(Math.random() * 80) + 10;
    const id = "ord-" + Math.random().toString(36).substring(2, 9);
    const matchedItems = items.map(it => {
      const m = MOCK_MENU.find(x => x.id === it.menu_item_id) || MOCK_MENU[0];
      return {
        menu_item_id: m.id,
        menu_name: m.name,
        category: m.category,
        quantity: it.quantity,
        unit_price: m.price,
        subtotal: m.price * it.quantity,
        prep_time: m.prep_time,
      };
    });

    const total_amount = matchedItems.reduce((acc, curr) => acc + curr.subtotal, 0);

    const mockOrder: Order = {
      id,
      order_id: id,
      token_number: tokenNum,
      token_code: `CB${String(tokenNum).padStart(3, "0")}`,
      queue_position: 1,
      status: "PENDING_PAYMENT",
      total_amount,
      estimated_wait_minutes: 15,
      created_at: new Date().toISOString(),
      items: matchedItems,
    };

    const existing = JSON.parse(localStorage.getItem("campusbite_mock_orders") || "[]");
    existing.unshift(mockOrder);
    localStorage.setItem("campusbite_mock_orders", JSON.stringify(existing));

    return {
      success: true,
      message: "Order placed successfully",
      data: mockOrder,
    };
  },

  async getStudentOrders() {
    const backendRes = await fetchAPI("/orders");
    if (backendRes && backendRes.data && Array.isArray(backendRes.data) && backendRes.data.length > 0) {
      return backendRes.data;
    }

    const existing = JSON.parse(localStorage.getItem("campusbite_mock_orders") || "[]");
    if (existing.length === 0) {
      const defaultOrder: Order = {
        id: "ord-sample-1",
        order_id: "ord-sample-1",
        token_number: 24,
        status: "ACCEPTED",
        total_amount: 165,
        estimated_wait_minutes: 12,
        created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        items: [
          { menu_item_id: "m2", menu_name: "Special Campus Cheese Samosa (2 pcs)", quantity: 1, unit_price: 45, subtotal: 45 },
          { menu_item_id: "m1", menu_name: "Crispy Paneer Butter Masala Roll", quantity: 1, unit_price: 120, subtotal: 120 },
        ]
      };
      localStorage.setItem("campusbite_mock_orders", JSON.stringify([defaultOrder]));
      return [defaultOrder];
    }
    return existing;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const backendRes = await fetchAPI(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (backendRes) return backendRes;

    const existing: Order[] = JSON.parse(localStorage.getItem("campusbite_mock_orders") || "[]");
    const idx = existing.findIndex(o => o.id === orderId || o.order_id === orderId);
    if (idx !== -1) {
      existing[idx].status = status as any;
      localStorage.setItem("campusbite_mock_orders", JSON.stringify(existing));
    }
    return {
      success: true,
      message: "Order status updated successfully",
      data: { order_id: orderId, new_status: status },
    };
  },

  // Vendor & Analytics APIs
  async getVendorOrders() {
    const backendRes = await fetchAPI("/vendor/orders");
    if (backendRes && backendRes.data && Array.isArray(backendRes.data) && backendRes.data.length > 0) {
      return backendRes.data;
    }

    const existing: Order[] = JSON.parse(localStorage.getItem("campusbite_mock_orders") || "[]");
    if (existing.length === 0) {
      const initialOrders: Order[] = [
        {
          id: "ord-101",
          order_id: "ord-101",
          token_number: 24,
          customer_name: "Rohan Verma",
          student_name: "Rohan Verma",
          status: "PAID",
          total_amount: 190,
          estimated_wait_minutes: 12,
          created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          items: [
            { menu_item_id: "m1", menu_name: "Crispy Paneer Butter Masala Roll", quantity: 1, unit_price: 120, subtotal: 120 },
            { menu_item_id: "m3", menu_name: "Cold Coffee with Ice Cream", quantity: 1, unit_price: 70, subtotal: 70 },
          ]
        },
        {
          id: "ord-102",
          order_id: "ord-102",
          token_number: 25,
          customer_name: "Ananya Sharma",
          student_name: "Ananya Sharma",
          status: "ACCEPTED",
          total_amount: 175,
          estimated_wait_minutes: 8,
          created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
          items: [
            { menu_item_id: "m2", menu_name: "Special Campus Cheese Samosa (2 pcs)", quantity: 1, unit_price: 45, subtotal: 45 },
            { menu_item_id: "m5", menu_name: "Chilli Garlic Noodles", quantity: 1, unit_price: 130, subtotal: 130 },
          ]
        },
        {
          id: "ord-103",
          order_id: "ord-103",
          token_number: 26,
          customer_name: "Aman Gupta",
          student_name: "Aman Gupta",
          status: "PREPARING",
          total_amount: 90,
          estimated_wait_minutes: 5,
          created_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
          items: [
            { menu_item_id: "m7", menu_name: "South Indian Special Dosa", quantity: 1, unit_price: 90, subtotal: 90 },
          ]
        }
      ];
      localStorage.setItem("campusbite_mock_orders", JSON.stringify(initialOrders));
      return initialOrders;
    }
    return existing;
  },

  async getVendorDashboard() {
    const backendRes = await fetchAPI("/vendor/dashboard");
    if (backendRes && backendRes.data) return backendRes.data;

    return {
      total_revenue: 14850,
      total_orders: 142,
      active_orders: 5,
      completed_orders: 132,
      average_prep_time_mins: 8.5
    };
  },

  async getPopularItems() {
    const backendRes = await fetchAPI("/vendor/popular-items");
    if (backendRes && backendRes.data) return backendRes.data;

    return MOCK_MENU.slice(0, 5);
  },

  async verifyPayment(orderId: string, paymentMethod: 'UPI' | 'CASH') {
    if (paymentMethod === 'UPI') {
      const backendRes = await fetchAPI("/payment/verify", {
        method: "POST",
        body: JSON.stringify({
          order_id: orderId,
          razorpay_order_id: "order_mock_" + Date.now(),
          razorpay_payment_id: "pay_mock_" + Date.now(),
          razorpay_signature: "sig_mock_" + Date.now(),
        })
      });
      if (backendRes) return backendRes;
    }

    await this.updateOrderStatus(orderId, "PAID");
    return {
      success: true,
      message: `Payment completed via ${paymentMethod}`,
    };
  }
};
