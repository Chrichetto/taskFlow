import express from "express";
import router from "./routes/route.js";
import cors from "cors"

const app = express();

app.use(cors());

app.use(express.json());

app.listen(3000, () => {
    console.log("Server in Ascolto sulla porta 3000");
});

app.use("/tasks", router);