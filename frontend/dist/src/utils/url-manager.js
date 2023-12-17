"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlManager = void 0;
class UrlManager {
    static getQueryParams() {
        const qs = document.location.hash.split('+').join(' ');
        let params = {}, tokens, re = /[?&]([^=]+)=([^&]*)/g;
        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
        return params;
    }
}
exports.UrlManager = UrlManager;
//# sourceMappingURL=url-manager.js.map