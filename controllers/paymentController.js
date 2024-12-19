const razorpay = require('../utility/razorpay');

const User = require('../models/userModel');
const Order = require('../models/order');

exports.createOrder = async (req,res)=>{
    try {
        const userId = req.user.userId;
        const amount = 1500;
        const currency = "INR";

        const order = await razorpay.orders.create({
            amount,
            currency,
        });

        await Order.create({
            userId,
            orderId:order.id,
            status:"PENDING",
            amount,
        });

        res.status(200).json({orderId: order.id, amount, currency });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};



exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // userId from the auth middleware
    const userId = req.user.userId;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const transactionStatus = razorpay_payment_id ? "SUCCESS" : "FAILED";

    await Order.create({
      userId, // Pass userId here
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id || null,
      signature: razorpay_signature || null,
      status: transactionStatus,
    });
    if (transactionStatus === "SUCCESS") {
      await User.update(
        { isPremium: true }, // Values to update
        { where: { id: userId } } // Condition to find the user
      );
    
    }
    return res.status(200).json({ message: `Transaction ${transactionStatus.toLowerCase()} successfully.` });
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
