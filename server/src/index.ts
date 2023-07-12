import express from "express";
import routes from "./api/routes";
import { createTables, dropTables } from "./db/createTables";

const app = express();
const port = 8001;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api", routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  // DROP TABLES - DEVELOPMENT ONLY
  //   dropTables().catch((error) => {
  //     console.error('Error:', error);
  //     });

  createTables().catch((error) => {
    console.error("Error:", error);
  });
});
