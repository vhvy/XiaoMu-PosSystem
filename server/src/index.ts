import "reflect-metadata";
import Koa from "koa";
import config from "@/config/index";
import "@/router/index";
import router from "@/router/router";
import { koaBody } from "koa-body";

const app = new Koa();

app.use(koaBody({}));
app.use(router.routes());

app.listen(config.port, () => {
    console.log(`Server is start, listen port on ${config.port}`);
});