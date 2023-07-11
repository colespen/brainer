"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./db/routes"));
const app = (0, express_1.default)();
const port = 3000;
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Routes
app.use("/api", routes_1.default);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
