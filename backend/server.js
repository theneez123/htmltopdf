import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import templateRoute from "./routes/template.route.js";
import bodyParser from "body-parser";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "https://htmltopdf-b7ag.onrender.com",
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", templateRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
