import "babel-polyfill";

import favicon from "koa-favicon";
import handlebars from "koa-handlebars";
import koa from "koa";
import mount from "koa-mount";
import route from "koa-route";
import serve from "koa-static";

let app = koa();

app.use(handlebars());

app.use(favicon("static/favicon.ico"));

app.use(mount("/static", serve("static")));

app.use(function*() {
    yield this.render("index", {});
});

app.listen(3000);
