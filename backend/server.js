import express from "express";
import cors from "cors";
import activityRoutes from "./routes/activities.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use(activityRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));

