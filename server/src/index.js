import express from "express";
import config from "./config/index.js";
import api from "./api/index.js";
import handleError from "./middleware/handleError.js";

const { port, allowOriginList } = config;
const app = express();

if (process.env.NODE_ENV === "development") {
    app.all("*", (req, res, next) => {
        const { origin } = req.headers;
        if (allowOriginList.includes(origin)) res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Headers", "Authorization,content-type");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        next();
    });
}

app.use(express.json());
app.use("/api", api);
app.use("*", (req, res) => {
    res.status(400).send({
        message: "错误请求!"
    })
});
app.use(handleError);

app.listen(port, () => {
    console.log(`Server Listen on port ${port}...`);
});