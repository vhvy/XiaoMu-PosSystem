import express from "express";

const route = express.Router();

route.get("/new", async (req, res) => {
    res.send({
        order_number: 201911251659
    });
});

export default route;