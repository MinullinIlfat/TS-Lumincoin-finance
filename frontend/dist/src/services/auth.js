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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const config_1 = __importDefault(require("../../config/config"));
class Auth {
    static processUnauthorizedResponse() {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = localStorage.getItem(this.refreshTokenKey);
            if (refreshToken) {
                const response = yield fetch(config_1.default.host + '/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken: refreshToken })
                });
                if (response && response.status === 200) {
                    const result = yield response.json();
                    if (result && !result.error && result.accessToken && result.refreshToken) {
                        this.setTokens(result.accessToken, result.refreshToken);
                        // this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                        // не видит .tokens
                        return true;
                    }
                }
            }
            this.removeTokens();
            location.href = '#/login';
            return false;
        });
    }
    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }
    static setUserInfo(info) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }
    static getUserInfo() {
        const userInfo = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    }
}
exports.Auth = Auth;
Auth.accessTokenKey = 'accessToken';
Auth.refreshTokenKey = 'refreshToken';
Auth.userInfoKey = 'userInfo';
//# sourceMappingURL=auth.js.map