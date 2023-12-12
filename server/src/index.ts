import express from "express";
import router from "./api/routes";
import { createTables } from "./db/createTables";
import cors from "cors";

const app = express();
const port = 8001;
const corsOptions = {
  // origin: "",
  origin: process.env.HOST_DEV, // for dev
  optionsSuccessStatus: 200,
};
////   (cors w no config accepts all origins/headers)
app.use(cors(corsOptions));

// setup cors middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api", router);

// Start the server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  try {
    await createTables();
    console.log("Tables created or verified successfully");
  } catch (error) {
    console.error("Error setting up database tables:", error);
  }
});
