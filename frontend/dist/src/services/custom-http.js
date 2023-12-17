"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomHttp = void 0;
const auth_1 = require("./auth");
class CustomHttp {
    static request(url, method = 'GET', body = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                method: method,
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
            };
            let token = localStorage.getItem(auth_1.Auth.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token;
            }
            if (body) {
                params.body = JSON.stringify(body);
            }
            const response = yield fetch(url, params);
            if (response.status < 200 || response.status >= 300) {
                if (response.status === 401) {
                    const result = yield auth_1.Auth.processUnauthorizedResponse();
                    if (result) {
                        return yield this.request(url, method, body);
                    }
                    else {
                        return null;
                    }
                }
                throw new Error(response.statusText);
            }
            return yield response.json();
        });
    }
}
exports.CustomHttp = CustomHttp;
//# sourceMappingURL=custom-http.js.map