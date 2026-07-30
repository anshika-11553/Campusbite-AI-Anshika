import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  console.warn(
    "⚠️ Warning: RAZORPAY_KEY_ID and/or RAZORPAY_KEY_SECRET are missing in environment variables."
  );
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId || "rzp_test_placeholder",
  key_secret: razorpayKeySecret || "placeholder_secret",
});

export default razorpay;
