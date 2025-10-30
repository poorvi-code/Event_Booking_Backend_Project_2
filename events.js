require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { body, param, validationResult } = require('express-validator');

const app = express();
app.use(express.json());


const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://poorviraik:Poorvi2123@cluster0.jmmgd.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db, eventsCollection, bookingsCollection;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("SynergiaDB");
    eventsCollection = db.collection("events");
    bookingsCollection = db.collection("bookings");
    console.log(" Connected to MongoDB and initialized collections.");
  } catch (err) {
    console.error(" MongoDB connection error:", err);
  }
}
connectDB();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map(err => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};


app.get("/api/events", async (req, res) => {
  try {
    const events = await eventsCollection.find().toArray();
    res.json({ success: true, message: "All events retrieved successfully", data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post(
  "/api/events",
  [
    body("name").notEmpty().withMessage("Event name is required"),
    body("date").notEmpty().withMessage("Date is required"),
    body("location").notEmpty().withMessage("Location is required"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, date, location, description } = req.body;
      const newEvent = { name, date, location, description: description || "", createdAt: new Date() };
      const result = await eventsCollection.insertOne(newEvent);
      res
        .status(201)
        .json({ success: true, message: "Event created successfully", data: { _id: result.insertedId, ...newEvent } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);


app.put(
  "/api/events/:id",
  [param("id").notEmpty().withMessage("Event ID is required")],
  handleValidationErrors,
  async (req, res) => {
    try {
      const eventId = req.params.id.trim();
      const { name, date, location, description } = req.body;

      const updateFields = {};
      if (name) updateFields.name = name;
      if (date) updateFields.date = date;
      if (location) updateFields.location = location;
      if (description) updateFields.description = description;

      const result = await eventsCollection.findOneAndUpdate(
        { _id: new ObjectId(eventId) },
        { $set: updateFields },
        { returnDocument: "after" }
      );

      if (!result.value) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }

      res.json({ success: true, message: "Event updated successfully", data: result.value });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);


app.delete(
  "/api/events/:id",
  [param("id").notEmpty().withMessage("Event ID is required")],
  handleValidationErrors,
  async (req, res) => {
    try {
      const eventId = req.params.id.trim();
      const result = await eventsCollection.deleteOne({ _id: new ObjectId(eventId) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }

      res.json({ success: true, message: "Event deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);


app.get("/api/bookings/search", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email query parameter is required" });
    }

    const result = await bookingsCollection
      .find({ email: { $regex: new RegExp(email, "i") } })
      .toArray();

    res.json({ success: true, message: "Bookings found", data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


app.get("/api/bookings/filter", async (req, res) => {
  try {
    const eventName = req.query.event;
    if (!eventName) {
      return res.status(400).json({
        success: false,
        message: "Event query parameter is required",
      });
    }

    const filteredBookings = await bookingsCollection
      .find({ event: { $regex: new RegExp(eventName, "i") } })
      .toArray();

    res.json({
      success: true,
      message: "Filtered bookings fetched successfully",
      data: filteredBookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await bookingsCollection.find().toArray();
    res.json({ success: true, message: "All bookings retrieved successfully", data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


app.get(
  "/api/bookings/:id",
  [param("id").notEmpty().withMessage("Booking ID is required")],
  handleValidationErrors,
  async (req, res) => {
    try {
      const bookingId = req.params.id.trim();
      const booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) });
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      res.json({ success: true, data: booking });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);


app.post(
  "/api/bookings",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("event").notEmpty().withMessage("Event is required"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, email, event, ticketType } = req.body;
      const newBooking = { name, email, event, ticketType, createdAt: new Date() };
      const result = await bookingsCollection.insertOne(newBooking);
      res
        .status(201)
        .json({ success: true, message: "Booking created successfully", data: { _id: result.insertedId, ...newBooking } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

app.put(
  "/api/bookings/:id",
  [
    param("id").notEmpty().withMessage("Booking ID is required"),
    body("email").optional().isEmail().withMessage("Must be a valid email"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const bookingId = req.params.id.trim();
      const { name, email, event, ticketType } = req.body;

      const updateFields = {};
      if (name) updateFields.name = name;
      if (email) updateFields.email = email;
      if (event) updateFields.event = event;
      if (ticketType) updateFields.ticketType = ticketType;

      const result = await bookingsCollection.findOneAndUpdate(
        { _id: new ObjectId(bookingId) },
        { $set: updateFields },
        { returnDocument: "after" }
      );

      if (!result.value) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      res.json({ success: true, message: "Booking updated successfully", data: result.value });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

app.delete(
  "/api/bookings/:id",
  [param("id").notEmpty().withMessage("Booking ID is required")],
  handleValidationErrors,
  async (req, res) => {
    try {
      const bookingId = req.params.id.trim();
      const result = await bookingsCollection.deleteOne({ _id: new ObjectId(bookingId) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      res.json({ success: true, message: "Booking cancelled successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Synergia Event Booking API running at http://localhost:${PORT}`);
});
