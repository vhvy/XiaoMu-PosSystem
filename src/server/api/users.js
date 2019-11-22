import express from "express";

const route = express.Router();

route.get("/", async (req, res) => {
    res.send({
        data: [
            "password"
        ]
    })
});

export default route;