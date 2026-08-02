import supabase from "../config/supabase.js";

// ==========================================
// Get Live Intelligence Data from Supabase
// ==========================================
export const getLiveAnalyticsRawData = async () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // 1. Fetch Orders with Order Items, Menu Items, and User info
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      id,
      user_id,
      status,
      total_amount,
      estimated_wait_minutes,
      created_at,
      updated_at,
      users (
        full_name,
        email
      ),
      order_items (
        quantity,
        unit_price,
        subtotal,
        menu_items (
          id,
          name,
          category,
          prep_time,
          price
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (ordersError) {
    throw ordersError;
  }

  // 2. Fetch All Menu Items
  const { data: menuItems, error: menuError } = await supabase
    .from("menu_items")
    .select("*");

  if (menuError) {
    throw menuError;
  }

  // 3. Fetch User Roles Count
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, role_id");

  return {
    orders: orders || [],
    menuItems: menuItems || [],
    totalUsersCount: (users || []).length,
    todayStartISO: todayStart.toISOString(),
  };
};

// ==========================================
// Save AI Recommendation to Supabase
// ==========================================
export const saveAIRecommendation = async (recData) => {
  try {
    const { data } = await supabase
      .from("ai_recommendations")
      .insert([
        {
          role: recData.role || "ALL",
          recommendation: recData.recommendation,
          confidence: recData.confidence || 0.95,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    return data;
  } catch (e) {
    return null;
  }
};

// ==========================================
// Save Pickup Prediction to Supabase
// ==========================================
export const savePickupPrediction = async (predData) => {
  try {
    const { data } = await supabase
      .from("pickup_predictions")
      .insert([
        {
          order_id: predData.orderId || null,
          predicted_ready_time: predData.predictedReadyTime,
          predicted_wait_minutes: predData.predictedWaitMinutes,
          confidence: predData.confidence || 0.95,
          calculation_timestamp: new Date().toISOString(),
        },
      ])
      .select();

    return data;
  } catch (e) {
    return null;
  }
};

// ==========================================
// Save Slot Predictions Snapshot to Supabase
// ==========================================
export const saveSlotPredictions = async (slotsArray) => {
  try {
    const records = (slotsArray || []).map((s) => ({
      slot: s.slot,
      date: s.date || new Date().toISOString().slice(0, 10),
      predicted_orders: s.predicted_orders || 0,
      predicted_wait: s.predicted_wait || 5,
      predicted_capacity: s.predicted_capacity || 15,
      recommended: s.recommended || false,
      generated_at: new Date().toISOString(),
    }));

    const { data } = await supabase
      .from("slot_predictions")
      .insert(records)
      .select();

    return data;
  } catch (e) {
    return null;
  }
};

// ==========================================
// Save Vendor Forecast Snapshot to Supabase
// ==========================================
export const saveVendorForecast = async (fcData) => {
  try {
    const { data } = await supabase
      .from("vendor_forecasts")
      .insert([
        {
          vendor_id: fcData.vendorId || "stall-a",
          generated_at: new Date().toISOString(),
          prediction_window: fcData.predictionWindow || "30m",
          predicted_orders: fcData.expectedOrders30m || 5,
          predicted_items: JSON.stringify(fcData.top5PredictedItems || []),
          confidence: fcData.confidence || 0.94,
        },
      ])
      .select();

    return data;
  } catch (e) {
    return null;
  }
};

// ==========================================
// Save Stall Recommendation to Supabase
// ==========================================
export const saveStallRecommendation = async (recData) => {
  try {
    const { data } = await supabase
      .from("stall_recommendations")
      .insert([
        {
          student_id: recData.studentId || null,
          menu_item_id: recData.menuItemId || null,
          recommended_stall: recData.recommendedStall,
          reason: recData.reason,
          predicted_time_saved: recData.predictedTimeSaved || 0,
          generated_at: new Date().toISOString(),
        },
      ])
      .select();

    return data;
  } catch (e) {
    return null;
  }
};

// ==========================================
// Save Admin Executive Report to Supabase
// ==========================================
export const saveAdminReport = async (reportData) => {
  try {
    const { data } = await supabase
      .from("admin_reports")
      .insert([
        {
          generated_at: new Date().toISOString(),
          report_type: reportData.reportType || "EXECUTIVE_BRAIN",
          metrics_json: JSON.stringify(reportData.metricsJson || {}),
          recommendation: reportData.recommendation || "",
          prediction: reportData.prediction || "",
          accuracy: reportData.accuracy || 0.96,
        },
      ])
      .select();

    return data;
  } catch (e) {
    return null;
  }
};

// ==========================================
// Save Arrival Prediction to Supabase
// ==========================================
export const saveArrivalPrediction = async (predData) => {
  try {
    const { data } = await supabase
      .from("arrival_predictions")
      .insert([
        {
          order_id: predData.orderId || null,
          student_id: predData.studentId || null,
          stall_id: predData.stallId || "stall-a",
          generated_at: new Date().toISOString(),
          estimated_ready_time: predData.estimatedReadyTime,
          estimated_leave_time: predData.estimatedLeaveTime,
          estimated_walk_time: predData.estimatedWalkTime || 5,
          estimated_wait_after_arrival: predData.estimatedWaitAfterArrival || "Less than 1 minute",
          prediction_confidence: predData.predictionConfidence || 0.94,
        },
      ])
      .select();

    return data;
  } catch (e) {
    return null;
  }
};

// ==========================================
// Update Arrival Prediction Accuracy on Order Ready
// ==========================================
export const updateArrivalAccuracy = async (orderId, actualReadyTime = new Date().toISOString()) => {
  try {
    const { data } = await supabase
      .from("arrival_predictions")
      .select("*")
      .eq("order_id", orderId)
      .order("generated_at", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      const pred = data[0];
      const predTime = new Date(pred.estimated_ready_time).getTime();
      const actualTime = new Date(actualReadyTime).getTime();
      const diffMins = Math.abs(Math.round((actualTime - predTime) / 60000));
      const accuracy = Math.max(0.70, Number((1 - diffMins / 30).toFixed(2)));

      await supabase
        .from("arrival_predictions")
        .update({
          actual_ready_time: actualReadyTime,
          prediction_accuracy: accuracy,
        })
        .eq("id", pred.id);
    }
  } catch (e) {
    console.log("Arrival Accuracy notice:", e.message);
  }
};

// ==========================================
// Save Chatbot Q&A Interaction History
// ==========================================
export const saveChatHistory = async (chatData) => {
  try {
    const { data, error } = await supabase
      .from("chat_history")
      .insert([
        {
          user_id: chatData.userId || null,
          role: chatData.roleId || "STUDENT",
          question: chatData.question,
          answer: chatData.answer,
          response_time_ms: chatData.responseTimeMs || 120,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.log("Chat History notice:", error.message);
    }
    return data;
  } catch (e) {
    return null;
  }
};

// ==========================================
// Get Student Active Order & Queue Position
// ==========================================
export const getStudentActiveOrder = async (userId) => {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      daily_tokens (
        token_number
      )
    `)
    .eq("user_id", userId)
    .not("status", "in", '("COLLECTED","COMPLETED","CANCELLED")')
    .order("created_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return null;
  }

  return data[0];
};

// ==========================================
// Get Oldest Accepted Order for Chef Priority
// ==========================================
export const getOldestAcceptedOrder = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      daily_tokens (
        token_number
      ),
      order_items (
        quantity,
        menu_items (
          name
        )
      )
    `)
    .in("status", ["ACCEPTED", "IN_KITCHEN", "PREPARING"])
    .order("created_at", { ascending: true })
    .limit(1);

  if (error || !data || data.length === 0) {
    return null;
  }

  return data[0];
};

// ==========================================
// Log Activity Event to Persistence Layer
// ==========================================
export const logActivityEvent = async (eventData) => {
  try {
    const { data, error } = await supabase
      .from("activity_logs")
      .insert([
        {
          event_type: eventData.event_type || "ORDER_UPDATE",
          order_id: eventData.order_id || null,
          user_id: eventData.user_id || null,
          details: JSON.stringify(eventData.details || {}),
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.log("Activity log notice:", error.message);
    }
    return data;
  } catch (e) {
    return null;
  }
};
