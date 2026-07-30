export interface KnowledgeIntent {
  id: string;
  keywords: string[];
  response: string;
  category: 'student' | 'vendor' | 'chief' | 'admin' | 'general';
}

export const CAMPUSBITE_KNOWLEDGE_BASE: KnowledgeIntent[] = [
  // GENERAL INTENTS
  {
    id: 'gen-about',
    keywords: ['campusbite', 'what is campusbite', 'about project', 'about app', 'purpose', 'problem', 'what problem'],
    category: 'general',
    response:
      'CampusBite AI is a zero-wait smart campus dining ecosystem designed to eliminate canteen queues, optimize meal pre-ordering, provide real-time token tracking, and streamline multi-role kitchen operations.',
  },
  {
    id: 'gen-developer',
    keywords: ['developer', 'who developed', 'who created', 'author', 'anshika', 'creator', 'hackathon'],
    category: 'general',
    response:
      'CampusBite AI was developed by Anshika Sharma as a production-ready hackathon demonstration project for smart university dining.',
  },
  {
    id: 'gen-techstack',
    keywords: ['technology', 'tech stack', 'technologies', 'framework', 'next.js', 'react', 'tailwind', 'typescript'],
    category: 'general',
    response:
      'CampusBite AI is built with Next.js 16 (App Router), React 19, TypeScript, TailwindCSS, Lucide Icons, and local web storage for 100% offline-ready client architecture.',
  },
  {
    id: 'gen-token-system',
    keywords: ['token system', 'how token works', 'unique token', 'token number', 'cb-1001', 'cb-1002', 'coupon'],
    category: 'general',
    response:
      'Orders receive a unique sequential token number (e.g. CB-1001, CB-1002). The token is displayed on Student Dashboard, Order History, Receipt, Vendor Counter, and Head Chef Workstation to guarantee single-use anti-duplicate pickup verification.',
  },
  {
    id: 'gen-payment-system',
    keywords: ['payment work', 'how payment works', 'upi qr', 'vendor qr', 'pay vendor', 'money'],
    category: 'general',
    response:
      'Payment is completed directly to the vendor via static or vendor-managed UPI QR code. The student scans the outlet QR, pays using any UPI app (GPay/PhonePe/Paytm), and clicks "I Have Completed Payment" to issue the token.',
  },
  {
    id: 'gen-pickup-system',
    keywords: ['pickup work', 'how pickup works', 'collect food', 'express counter', 'counter a'],
    category: 'general',
    response:
      'When your order status turns to "Ready for Pickup", visit Counter A, show your token number (e.g. CB-1001), and the vendor will verify the token before clicking "Mark Delivered".',
  },

  // STUDENT INTENTS
  {
    id: 'std-place-order',
    keywords: ['order food', 'place order', 'how to order', 'buy food', 'menu', 'where is menu', 'catalogue'],
    category: 'student',
    response:
      'To place an order: 1. Go to "Explore Menu" in Student Dashboard. 2. Add items to cart. 3. Click "Checkout" in Topbar or Floating Cart. 4. Select pickup time slot. 5. Scan Vendor UPI QR and click "I Have Completed Payment".',
  },
  {
    id: 'std-payment',
    keywords: ['checkout', 'payment', 'upi', 'scan qr', 'pay', 'cart', 'canteen card', 'wallet'],
    category: 'student',
    response:
      'During checkout, you will see the vendor\'s custom UPI QR code and UPI ID. Scan the code using GPay, PhonePe, or Paytm, pay the exact order amount (incl. 5% GST), and confirm completion.',
  },
  {
    id: 'std-[#054A36]',
    keywords: ['token', 'my token', 'where is token', 'queue number', 'ticket'],
    category: 'student',
    response:
      'Your active token number is generated immediately after payment confirmation and is visible on your Student Dashboard overview banner and digital receipt.',
  },
  {
    id: 'std-receipt',
    keywords: ['receipt', 'download receipt', 'pdf', 'invoice', 'print receipt', 'bill'],
    category: 'student',
    response:
      'You can view and download your official PDF receipt anytime by clicking "View & Download Official Receipt" on the checkout screen or via "Order History" in the Student menu.',
  },
  {
    id: 'std-status',
    keywords: ['order status', 'live tracking', 'where is my food', 'preparing', 'ready', 'collected'],
    category: 'student',
    response:
      'Track your live order stages: Accepted by Vendor → Sent to Kitchen → Kitchen Preparing → Ready for Pickup at Counter A → Order Collected.',
  },
  {
    id: 'std-rewards',
    keywords: ['rewards', 'loyalty points', 'coins', 'cashback', 'student points', 'discount'],
    category: 'student',
    response:
      'Earn 10 Canteen Reward Points for every order! Redeem accumulated points for free cold coffee, desserts, and express queue priority vouchers in the Rewards tab.',
  },
  {
    id: 'std-profile',
    keywords: ['edit profile', 'change photo', 'upload avatar', 'update name', 'profile picture', 'department'],
    category: 'student',
    response:
      'Go to Student Profile (/student/profile) to edit your full name, university email, phone number, academic department, and upload/preview your personal profile avatar.',
  },
  {
    id: 'std-darkmode',
    keywords: ['dark mode', 'theme', 'light mode', 'toggle theme', 'color theme'],
    category: 'student',
    response:
      'Toggle dark/light mode anytime by clicking the Sun/Moon icon on the Topbar navigation bar.',
  },

  // VENDOR INTENTS
  {
    id: 'ven-accept-reject',
    keywords: ['accept order', 'reject order', 'incoming orders', 'pending order', 'new order'],
    category: 'vendor',
    response:
      'New paid orders arrive in the Vendor Dashboard "Incoming Orders" section. Click "Accept Order" to confirm or "Reject" to cancel.',
  },
  {
    id: 'ven-verify-token',
    keywords: ['verify token', 'mark delivered', 'counter pickup', 'handover', 'deliver order'],
    category: 'vendor',
    response:
      'When a student arrives at Counter A, click "Verify Token & Mark Delivered", enter/confirm the student\'s token number (e.g. CB-1001), and mark completed.',
  },
  {
    id: 'ven-manage-qr',
    keywords: ['upload qr', 'replace qr', 'remove qr', 'upi id', 'payment settings', 'vendor qr'],
    category: 'vendor',
    response:
      'Go to Vendor Settings (/vendor/settings) → UPI Payment Settings to upload your personal QR image (PNG/JPG/WEBP), update your merchant UPI ID handle, and save changes.',
  },
  {
    id: 'ven-[#054A36]',
    keywords: ['kitchen queue', 'forward to kitchen', 'chef queue', 'canteen orders'],
    category: 'vendor',
    response:
      'After accepting an order, click "Forward to Kitchen" to push tickets directly onto the Head Chef KDS workstation.',
  },

  // HEAD CHEF INTENTS
  {
    id: 'chef-stages',
    keywords: ['cooking queue', 'cooking stage', 'advance stage', 'ingredients ready', 'garnishing', 'packing'],
    category: 'chief',
    response:
      'The Head Chef Workstation tracks 7 visual cooking stages: Accepted → Ingredients Ready → Cooking → Half Prepared → Garnishing → Packing → Ready for Pickup. Click "Advance Stage" on any active ticket.',
  },
  {
    id: 'chef-priority',
    keywords: ['priority orders', 'high priority', 'urgent ticket', 'kitchen queue'],
    category: 'chief',
    response:
      'Orders marked with HIGH priority (e.g. express student passes) appear at the top of the chef prep list with amber flame indicators.',
  },

  // ADMIN INTENTS
  {
    id: 'admin-vendor-management',
    keywords: ['create vendor', 'edit vendor', 'delete vendor', 'manage vendors', 'outlet list'],
    category: 'admin',
    response:
      'Navigate to Admin → Vendors (/admin/vendors) to add new canteen outlets, edit licensee info, toggle operational/deactivated status, and audit vendor QR settings.',
  },
  {
    id: 'admin-chef-management',
    keywords: ['create head chef', 'edit chef', 'delete chef', 'kitchen staff', 'chef list'],
    category: 'admin',
    response:
      'Navigate to Admin → Head Chefs (/admin/chefs) to register new kitchen head chefs, assign outlet stations, and manage kitchen staff accounts.',
  },
  {
    id: 'admin-financial-reports',
    keywords: ['revenue', 'financial report', 'pdf report', 'export report', 'transaction audit', 'payment log'],
    category: 'admin',
    response:
      'Go to Admin → Financial Reports (/admin/reports) to inspect daily/weekly/monthly revenue breakdowns, live payment logs with tokens, vendor commissions, and click "Export Financial Audit PDF".',
  },
];

export const UNKNOWN_FALLBACK_RESPONSE =
  "I'm sorry, I don't have information about that yet. Please contact the administrator or ask a question related to CampusBite AI.";

export function getChatbotResponse(userQuery: string, role: string = 'student'): string {
  const queryClean = userQuery.toLowerCase().trim();
  if (!queryClean) return 'Please type a question or choose one of the quick suggestions below!';

  // Search through role-specific and general intents
  for (const intent of CAMPUSBITE_KNOWLEDGE_BASE) {
    if (intent.category === 'general' || intent.category === role) {
      const isMatched = intent.keywords.some((kw) => queryClean.includes(kw.toLowerCase()));
      if (isMatched) {
        return intent.response;
      }
    }
  }

  // Fallback to global match if role-specific missed
  for (const intent of CAMPUSBITE_KNOWLEDGE_BASE) {
    const isMatched = intent.keywords.some((kw) => queryClean.includes(kw.toLowerCase()));
    if (isMatched) {
      return intent.response;
    }
  }

  return UNKNOWN_FALLBACK_RESPONSE;
}
