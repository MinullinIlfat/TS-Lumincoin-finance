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
exports.SignUp = void 0;
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
const auth_1 = require("../services/auth");
class SignUp {
    constructor(page) {
        this.fields = [];
        this.processElement = null;
        this.agreeElement = null;
        this.page = page;
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false
            },
        ];
        if (this.page === 'signup') {
            this.fields.unshift({
                name: 'name',
                id: 'name',
                element: null,
                regex: /^[А-Я][а-я]+\s*$/,
                valid: false
            }, {
                name: 'confirm-password',
                id: 'confirm-password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false
            });
        }
        const that = this;
        this.fields.forEach((item) => {
            item.element = document.getElementById(item.id);
            if (item.element) {
                item.element.onchange = function () {
                    that.validateField.call(that, item, this);
                };
            }
        });
        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.onclick = function () {
                that.processForm();
            };
        }
        if (this.page === 'login') {
            this.agreeElement = document.getElementById('flexCheckDefault');
            if (this.agreeElement) {
                this.agreeElement.onchange = function () {
                    that.validateForm();
                };
            }
        }
    }
    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.setProperty("border", "1px solid red", "important");
            field.valid = false;
        }
        else {
            element.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }
    validateForm() {
        const confirmPassword = document.getElementById('confirm-password');
        const password = document.getElementById('password');
        const validForm = this.fields.every(item => item.valid);
        const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm;
        if (this.processElement) {
            if (isValid) {
                this.processElement.removeAttribute('disabled');
            }
            else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
            if (this.page === 'signup') {
                if (confirmPassword.value !== password.value) {
                    password.style.setProperty("border", "1px solid red", "important");
                    confirmPassword.style.setProperty("border", "1px solid red", "important");
                    this.processElement.setAttribute('disabled', 'disabled');
                }
                else {
                    password.removeAttribute('style');
                    confirmPassword.removeAttribute('style');
                    this.processElement.removeAttribute('disabled');
                }
            }
        }
        return isValid;
    }
    processForm() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.validateForm()) {
                const email = (_b = (_a = this.fields.find(item => item.name === 'email')) === null || _a === void 0 ? void 0 : _a.element) === null || _b === void 0 ? void 0 : _b.value;
                const password = (_d = (_c = this.fields.find(item => item.name === 'password')) === null || _c === void 0 ? void 0 : _c.element) === null || _d === void 0 ? void 0 : _d.value;
                if (this.page === 'signup') {
                    const passwordRepeat = (_f = (_e = this.fields.find(item => item.name === 'confirm-password')) === null || _e === void 0 ? void 0 : _e.element) === null || _f === void 0 ? void 0 : _f.value;
                    try {
                        const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/signup', 'POST', {
                            name: (_h = (_g = this.fields.find(item => item.name === 'name')) === null || _g === void 0 ? void 0 : _g.element) === null || _h === void 0 ? void 0 : _h.value,
                            lastName: (_k = (_j = this.fields.find(item => item.name === 'name')) === null || _j === void 0 ? void 0 : _j.element) === null || _k === void 0 ? void 0 : _k.value,
                            email: email,
                            password: password,
                            passwordRepeat: passwordRepeat,
                        });
                        if (result) {
                            if (!result.user) {
                                console.log(123);
                            }
                        }
                    }
                    catch (error) {
                        console.log(error);
                        return;
                    }
                }
                try {
                    const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/login', 'POST', {
                        email: email,
                        password: password,
                    });
                    if (result) {
                        if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken
                            || !result.user.name || !result.user.id || !result.user.lastName) {
                            throw new Error(result.message);
                        }
                        auth_1.Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                        auth_1.Auth.setUserInfo({
                            fullName: result.user.name,
                            userId: result.user.id
                        });
                        location.href = '#/';
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    }
}
exports.SignUp = SignUp;
//# sourceMappingURL=signup.js.map