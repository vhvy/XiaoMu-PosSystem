import express from "express";
import config from "./config/index.js";
import api from "./api/index.js";

const { port } = config;
const app = express();

if (process.env.NODE_ENV === "development") {
    app.all("*", (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "http://127.0.0.1:9000");
        res.header("Access-Control-Allow-Headers", "Authorzation,content-type");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        next();
    });
}

app.use(express.json());
app.use("/api", api);

app.listen(port, () => {
    console.log(`Server Listen on port ${port}...`);
});