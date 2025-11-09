import Order from "../Models/Order.js";
import Cart from "../Models/Cartmodel.js";
import Product from "../Models/Productmodel.js";

// ✅ CREATE ORDER FROM USER CART
export const createOrder = async (req, res) => {
  const userId = req.user._id;
  const { paymentMethod, shippingAddress } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty, cannot create order" });
    }

    // ✅ Calculate latest, true price from DB — prevents cheating
    const items = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
      name: item.productId.name,
      image: item.productId.image,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = await Order.create({
      userId,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      status: "Pending",  // ✅ default
    });

    // ✅ Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ GET ALL USER ORDERS
export const getUserOrders = async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ GET SINGLE ORDER
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ UPDATE ORDER STATUS (Admin Only, Delivery System)
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "Pending",
    "Paid",
    "Packaged",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
