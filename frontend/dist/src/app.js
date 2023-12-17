"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
class App {
    constructor() {
        this.router = new router_1.Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }
    handleRouteChanging() {
        this.router.openRoute();
    }
}
(new App());
//# sourceMappingURL=app.js.map