import "@/utils/index";
import Koa from "koa";
import routes from "@/app/routes/index";
import middleware from "@/app/middleware/index";
import config from "@/config/index";

const { port } = config;

const app = new Koa();

middleware(app);
routes(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});

export default app;