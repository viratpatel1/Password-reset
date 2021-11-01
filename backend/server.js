import express from "express";
import mongoose from "mongoose";
import { route } from "./routes/router.js";
import cors from "cors";
// import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());



// ----For Deployment-------


// if (process.env.NODE_ENV === "production")
// {
//     app.use(express.static("frontend/build"));
//     // app.get("*", (req, res) =>
//     // {
//     //     res.sendFile(path.resolve(__dirname, "build", "index.html"));
//     // })
// }
// else
// {
//     app.get("/", (req, res) =>
//     {
//         res.send("Node Started Correctly Online");
//     });
// }

mongoose.connect(process.env.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DataBase Connected Successfully"))
    .catch(() => console.log("Something Went Wrong"));

app.use("/", route);





app.listen(PORT, () => console.log(`Server Started at ${PORT}`));