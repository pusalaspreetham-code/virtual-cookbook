require("dotenv").config();
const express = require("express");
const cors = require("cors");          
const connectDB = require("./config/db");

const app = express();

connectDB();

// ✅ middleware
app.use(cors());                       
app.use(express.json());

// ✅ routes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

const recipeRoutes = require("./routes/recipe");
app.use("/api", recipeRoutes);

const favoriteRoutes = require("./routes/favorite");
app.use("/api", favoriteRoutes);

const communityRoutes = require("./routes/community");
app.use("/api", communityRoutes);


// ✅ test route
app.get("/", (_req, res) => {
  res.send("Server running");
});

// ✅ start server
app.listen(5000, () => {
  console.log("Server running at 5000");
});