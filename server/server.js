// server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { MongoClient,ObjectId } from "mongodb";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URI and DB details
const uri = process.env.MONGO_URI;
const dbName = "hallbooking";

let client;

try {
    client = new MongoClient(uri);
    await client.connect(); // top-level await works in ESM
    console.log("Connected to MongoDB successfully");
} catch (error) {
    console.error("Error during MongoDB connection:", error);
    process.exit(1); // Stop the server if DB can't connect
}

// AdminLogin Route
app.post("/adminlogin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = client.db(dbName);
        const adminCollection = db.collection("admin");

        const admin = await adminCollection.findOne({ email, password });

        if (admin) {
            res.json({ success: true, message: "Login successful", admin });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error during login", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

//OwnerLogin Route
app.post("/ownerlogin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = client.db(dbName);
        const ownerCollection = db.collection("approved_owners");

        const owner = await ownerCollection.findOne({ email, password });

        if (owner) {
            res.json({ success: true, message: "Login successful", owner });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error during login", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

//CustomerLogin Route
app.post("/customerlogin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = client.db(dbName);
        const customerCollection = db.collection("customers");

        const customer = await customerCollection.findOne({ email, password });

        if (customer) {
            res.json({ success: true, message: "Login successful", customer });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error during login", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.post("/customerregister", async (req, res) => {
    const { name, email, password, number, address } = req.body;

    try {
        const db = client.db(dbName);
        const customerCollection = db.collection("customers");

        // Check if the email already exists
        const existingCustomer = await customerCollection.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const result = await customerCollection.insertOne({
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),  // You should hash this!
            number: number.trim(),
            address: address.trim()
        });

        if (result.acknowledged) {
            res.json({ success: true, message: "Customer registered successfully", customerId: result.insertedId });
        } else {
            res.status(500).json({ success: false, message: "Customer not registered" });
        }
    } catch (error) {
        console.error("Error during customer registration:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


//OwnerRegister Route
app.post("/ownerregister", async (req, res) => {
    const { name, email, password, number, address, hallname, location} = req.body;

    try {
        const db = client.db(dbName);
        const ownerCollection = db.collection("owners");

        // Check if the email already exists
        const existingowner = await ownerCollection.findOne({ email });
        if (existingowner) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const result = await ownerCollection.insertOne({
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),  
            number: number.trim(),
            address: address.trim(),
            hallname: hallname.trim(),
            location: location.trim()
        });

        if (result.acknowledged) {
            res.json({ success: true, message: "Application successfull", ownerId: result.insertedId });
        } else {
            res.status(500).json({ success: false, message: "Hall Owner not registered" });
        }
    } catch (error) {
        console.error("Error during hall owner registration:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// HallRegister Route
app.post("/hallregister", async (req, res) => {
  const {
    name,
    owner_id,
    capacity,
    address,
    price,
    amenities,
    daysOpen
  } = req.body;

  try {
    const db = client.db("hallbooking");
    const hallCollection = db.collection("applied_halls");

    // Basic validation 
    if (!name || !owner_id  || !capacity || !price) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const result = await hallCollection.insertOne({
      name: name.trim(),
      owner_id: owner_id,
      capacity: Number(capacity),
      address: address?.trim() || "",
      price: Number(price),
      amenities: Array.isArray(amenities) ? amenities : [],
      daysOpen: Array.isArray(daysOpen) ? daysOpen : []
    });

    if (result.acknowledged) {
      res.json({ success: true, message: "Hall registered successfully", hallId: result.insertedId });
    } else {
      res.status(500).json({ success: false, message: "Hall registration failed" });
    }
  } catch (error) {
    console.error("Error during hall registration:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


//AdminDashboard Route
// GET /owners - Get all owner documents
app.get("/owners", async (req, res) => {
  try {
    const db = client.db(dbName);
    const ownersCollection = db.collection("owners");

    const owners = await ownersCollection.find().toArray();
    res.json({ success: true, owners });
  } catch (error) {
    console.error("Error fetching owners:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//Approve Owners
app.post("/owners/approve/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const db = client.db("hallbooking");
    const ownersCollection = db.collection("owners");
    const approvedOwnersCollection = db.collection("approved_owners");

    const owner = await ownersCollection.findOne({ _id: new ObjectId(id) });

    if (!owner) {
      return res.status(404).json({ success: false, message: "Owner not found" });
    }

    await approvedOwnersCollection.insertOne(owner);
    await ownersCollection.deleteOne({ _id: new ObjectId(id) });

    res.json({ success: true, message: "Owner approved and moved" });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Approve halls
app.post("/halls/approve/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid hall ID" });
    }

    const db = client.db("hallbooking");
    const hallsCollection = db.collection("applied_halls");
    const approvedHallsCollection = db.collection("approved_halls");

    const hall = await hallsCollection.findOne({ _id: new ObjectId(id) });

    if (!hall) {
      return res.status(404).json({ success: false, message: "Hall not found" });
    }

    await approvedHallsCollection.insertOne(hall);
    await hallsCollection.deleteOne({ _id: new ObjectId(id) });

    res.json({ success: true, message: "Hall approved and moved" });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


//Reject Owners
app.delete("/owners/reject/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const db = client.db("hallbooking");
    const ownersCollection = db.collection("owners");

    const result = await ownersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Owner not found" });
    }

    res.json({ success: true, message: "Owner rejected and deleted" });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Reject halls
app.delete("/halls/reject/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const db = client.db("hallbooking");
    const hallsCollection = db.collection("applied_halls");

    const result = await hallsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Hall not found" });
    }

    res.json({ success: true, message: "Hall rejected and deleted" });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// get Halls
app.get("/halls", async (req, res) => {
  try {
    const db = client.db(dbName);
    const hallCollection = db.collection("applied_halls");

    const halls = await hallCollection.find().toArray();
    res.json({ success: true, halls });
  } catch (error) {
    console.error("Error fetching halls:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// get approved Halls
app.get("/halls/list", async (req, res) => {
  try {
    const db = client.db(dbName);
    const hallCollection = db.collection("approved_halls");

    const halls = await hallCollection.find().toArray();
    res.json({ success: true, halls });
  } catch (error) {
    console.error("Error fetching halls:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//Owner Dashboard Route 
//fetch owner details for profile
app.get("/owner/:ownerId", async (req, res) => {
  const { ownerId } = req.params;
  try {
    const db = client.db("hallbooking");
    const owners = db.collection("approved_owners");
    const owner = await owners.findOne({ _id: new ObjectId(ownerId) });

    if (owner) {
      res.json({ success: true, owner });
    } else {
      res.status(404).json({ success: false, message: "Owner not found" });
    }
  } catch (error) {
    console.error("Error fetching owner profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// get owners approved halls
app.get("/halls/list/:ownerId", async (req, res) => {
  try {
    const db = client.db(dbName);
    const hallCollection = db.collection("approved_halls");
    

    const halls = await hallCollection.find({ owner_id: req.params.ownerId }).toArray();
    res.json({ success: true, halls });
  } catch (error) {
    console.error("Error fetching halls:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


//fetch customer details for profile
app.get("/customer/:customerId", async (req, res) => {
  const { customerId } = req.params;
  try {
    const db = client.db("hallbooking");
    const customers = db.collection("customers");
    const customer = await customers.findOne({ _id: new ObjectId(customerId) });

    if (customer) {
      res.json({ success: true, customer });
    } else {
      res.status(404).json({ success: false, message: "customer not found" });
    }
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/bookings", async (req, res) => {
    const { hallId, customerId, date, occasion } = req.body;

    try {
        const db = client.db("hallbooking");
        const bookingsCollection = db.collection("bookings");

        // Check for existing booking on the same date for the same hall
        const existingBooking = await bookingsCollection.findOne({
            hallId,
            date
        });

        if (existingBooking) {
            return res.status(400).json({ success: false, message: "Selected date is already booked for this hall." });
        }

        const result = await bookingsCollection.insertOne({
            hallId,
            customerId,
            date,
            occasion,
            createdAt: new Date()
        });

        if (result.acknowledged) {
            res.json({ success: true, message: "Booking successful", bookingId: result.insertedId });
        } else {
            res.status(500).json({ success: false, message: "Failed to create booking" });
        }
    } catch (error) {
        console.error("Error while creating booking:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

//Fetch bookings
app.get("/bookings/byHall/:hallId", async (req, res) => {
  const { hallId } = req.params;

  try {
    const db = client.db("hallbooking");
    const bookingsCollection = db.collection("bookings");
    const customersCollection = db.collection("customers");

    // TEMP log
    const rawBookings = await bookingsCollection.find().toArray();

    // Check query
    const bookings = await bookingsCollection.find({ hallId}).toArray();

    const bookingsWithCustomer = await Promise.all(bookings.map(async (booking) => {
      const customer = await customersCollection.findOne({ _id: new ObjectId(booking.customerId) });
      return {
        ...booking,
        customer: customer ? {
          name: customer.name,
          email: customer.email,
          number: customer.number
        } : {}
      };
    }));

    res.json({ success: true, bookingsWithCustomer });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch bookings by customer
app.get("/bookings/byCustomer/:customerId", async (req, res) => {
    const { customerId } = req.params;
    try{
        const db = client.db("hallbooking");
        const bookingsCollection = db.collection("bookings");
        const hallsCollection = db.collection("approved_halls");

        const bookings = await bookingsCollection.find({ customerId }).toArray();

        const bookingsWithHallDetails = await Promise.all(bookings.map(async (booking) => {
            const hall = await hallsCollection.findOne({ _id: new ObjectId(booking.hallId) });
            return {
                ...booking,
                hall: hall ? {
                    name: hall.name,
                    address: hall.address,
                    price: hall.price
                } : {}
            };
        }));

        res.json({ success: true, bookingsWithHallDetails });
    }
    catch (error) {
        console.error("Error fetching bookings by customer:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port${PORT}`);
});
