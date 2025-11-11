import Order from "../Models/Order.js";
import Cart from "../Models/Cartmodel.js";

// ✅ CREATE ORDER FROM USER CART
export const createOrder = async (req, res) => {
  const userId = req.user._id;
  const { paymentMethod, shippingAddress } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const items = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      image: item.productId.image,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // ✅ Set status depending on payment method
    const status = paymentMethod === "Cash" ? "Pending" : "Awaiting Payment";

    const newOrder = await Order.create({
      userId,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      status,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message:
        paymentMethod === "Cash"
          ? "Order created! Pay on delivery."
          : "Order created. Proceed to payment.",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// ✅ GET ALL ORDERS FOR CURRENT USER
export const getUserOrders = async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ✅ GET SINGLE ORDER BY ID
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ✅ UPDATE ORDER STATUS (ADMIN ONLY)
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["Pending", "Paid", "Packaged", "Out for Delivery", "Delivered", "Cancelled"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ✅ GET ALL ORDERS (ADMIN ONLY)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
