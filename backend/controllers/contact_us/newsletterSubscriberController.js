const NewsLetterSubscriber = require("../../models/contact_us/newsletterSubscriberModel");

// Create subscriber
exports.createSubscriber = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;

    if (!first_name || !last_name || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existing = await NewsLetterSubscriber.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email is already subscribed" });
    }

    const subscriber = await NewsLetterSubscriber.create({
      first_name,
      last_name,
      email
    });

    res.status(201).json(subscriber);
  } catch (error) {
    res.status(500).json({ message: "Error subscribing", error: error.message });
  }
};

// Get all subscribers
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await NewsLetterSubscriber.findAll();
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscribers", error: error.message });
  }
};

// Get single subscriber by ID
exports.getSubscriberById = async (req, res) => {
  try {
    const subscriber = await NewsLetterSubscriber.findByPk(req.params.id);
    if (!subscriber) return res.status(404).json({ message: "Subscriber not found" });

    res.status(200).json(subscriber);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscriber", error: error.message });
  }
};

// Delete subscriber
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await NewsLetterSubscriber.findByPk(req.params.id);
    if (!subscriber) return res.status(404).json({ message: "Subscriber not found" });

    await subscriber.destroy();
    res.status(200).json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subscriber", error: error.message });
  }
};
