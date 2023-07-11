import express from "express";
import routes from "./db/routes";

const app = express();
const port = 8001;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api", routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
