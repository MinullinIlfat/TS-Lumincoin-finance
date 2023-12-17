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
exports.CreateIncomeOrExpenses = void 0;
const auth_1 = require("../services/auth");
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
class CreateIncomeOrExpenses {
    constructor() {
        this.newCreateTypeOperation = document.getElementById('new-create-type-operation');
        this.newCreateCategoryOperation = document.getElementById('new-create-category-operation');
        this.newCreateAmountOperation = document.getElementById('new-create-amount-operation');
        this.newCreateDateOperation = document.getElementById('new-create-date-operation');
        this.newCreateCommentOperation = document.getElementById('new-create-comment-operation');
        this.saveNewCreateOperation = document.getElementById('save-new-create-operation');
        this.category = null;
        this.Categories();
    }
    Categories() {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = auth_1.Auth.getUserInfo();
            if (!userInfo) {
                location.href = '#/login';
            }
            try {
                const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/categories/income');
                if (result) {
                    this.createNewOperation();
                }
                result.forEach(item => {
                    const option = document.createElement('option');
                    option.setAttribute('value', item.title);
                    option.setAttribute('id', item.id.toString());
                    option.className = 'option-element';
                    option.innerText = item.title;
                    if (this.newCreateTypeOperation && this.newCreateCategoryOperation) {
                        let indexSelected = this.newCreateTypeOperation.selectedIndex, options = this.newCreateTypeOperation.querySelectorAll('option')[indexSelected];
                        let selectedId = options.getAttribute('id');
                        if (selectedId === 'one') {
                            option.style.display = 'block';
                        }
                        else {
                            option.style.display = 'none';
                        }
                        this.newCreateCategoryOperation.appendChild(option);
                        this.newCreateTypeOperation.addEventListener('change', (e) => {
                            if (this.newCreateTypeOperation && this.newCreateCategoryOperation && this.newCreateTypeOperation.value === 'expense') {
                                option.style.display = 'none';
                                this.newCreateCategoryOperation.value = ' ';
                            }
                            else {
                                option.style.display = 'block';
                            }
                        });
                        this.newCreateCategoryOperation.addEventListener('change', (e) => {
                            result.forEach((item) => {
                                if (item.title && this.newCreateCategoryOperation && this.newCreateCategoryOperation.value === item.title) {
                                    this.category = item.id.toString();
                                    // return this.category;
                                }
                            });
                        });
                    }
                });
                const resultExpense = yield custom_http_1.CustomHttp.request(config_1.default.host + '/categories/expense');
                this.createNewOperation();
                resultExpense.forEach((itemExp) => {
                    const optionExp = document.createElement('option');
                    optionExp.setAttribute('value', itemExp.title);
                    optionExp.setAttribute('id', itemExp.id.toString());
                    optionExp.className = 'option-element-exp';
                    optionExp.innerText = itemExp.title;
                    if (this.newCreateTypeOperation && this.newCreateCategoryOperation) {
                        let indexSelected = this.newCreateTypeOperation.selectedIndex, option = this.newCreateTypeOperation.querySelectorAll('option')[indexSelected];
                        let selectedId = option.getAttribute('id');
                        if (selectedId === 'two') {
                            optionExp.style.display = 'block';
                        }
                        else {
                            optionExp.style.display = 'none';
                        }
                        this.newCreateCategoryOperation.appendChild(optionExp);
                        this.newCreateTypeOperation.addEventListener('change', (e) => {
                            if (this.newCreateTypeOperation && this.newCreateCategoryOperation
                                && this.newCreateTypeOperation.value === 'income') {
                                optionExp.style.display = 'none';
                                this.newCreateCategoryOperation.value = ' ';
                            }
                            else {
                                optionExp.style.display = 'block';
                            }
                        });
                        this.newCreateCategoryOperation.addEventListener('change', (e) => {
                            resultExpense.forEach(item => {
                                if (item.title && this.newCreateCategoryOperation && this.newCreateCategoryOperation.value === item.title) {
                                    this.category = item.id.toString();
                                    // return this.category;
                                }
                            });
                        });
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createNewOperation() {
        const that = this;
        if (this.saveNewCreateOperation) {
            this.saveNewCreateOperation.onclick = function () {
                const userInfo = auth_1.Auth.getUserInfo();
                if (!userInfo) {
                    location.href = '#/login';
                }
                if (that.newCreateTypeOperation && that.newCreateAmountOperation
                    && that.newCreateDateOperation && that.newCreateCommentOperation) {
                    try {
                        const result = custom_http_1.CustomHttp.request(config_1.default.host + '/operations', "POST", {
                            type: that.newCreateTypeOperation.value,
                            category_id: that.category,
                            amount: that.newCreateAmountOperation.value,
                            date: that.newCreateDateOperation.value,
                            comment: that.newCreateCommentOperation.value
                        });
                        if (result) {
                            location.href = '#/IncomeAndExpense';
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            };
        }
    }
}
exports.CreateIncomeOrExpenses = CreateIncomeOrExpenses;
//# sourceMappingURL=createIncomeOrExpenses.js.map