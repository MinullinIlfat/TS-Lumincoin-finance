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
exports.EditIncomeOrExpenses = void 0;
const auth_1 = require("../services/auth");
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
class EditIncomeOrExpenses {
    constructor() {
        this.createTypeOperation = document.getElementById('create-type-operation');
        this.createCategoryOperation = document.getElementById('create-category-operation');
        this.createAmountOperation = document.getElementById('create-amount-operation');
        this.createDateOperation = document.getElementById('create-date-operation');
        this.createCommentOperation = document.getElementById('create-comment-operation');
        this.createOperationSaveBtn = document.getElementById('create-operation-save-btn');
        this.category = null;
        this.Categories();
    }
    Categories() {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = auth_1.Auth.getUserInfo();
            if (!userInfo) {
                location.href = '#/login';
            }
            let type = localStorage.getItem('Type');
            if (type) {
                type = type.replace(/[^а-яёa-z]/gi, ' ');
                type = type.replace(/\s+/g, ' ').trim();
            }
            let category = localStorage.getItem('Category');
            if (category) {
                category = category.replace(/[^а-яёa-z1-9]/gi, ' ');
                category = category.replace(/\s+/g, ' ').trim();
            }
            try {
                const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/categories/income');
                if (result) {
                    result.forEach((item) => {
                        const option = document.createElement('option');
                        option.setAttribute('value', item.title);
                        option.setAttribute('id', item.id.toString());
                        option.className = 'option-element';
                        option.innerText = item.title;
                        if (this.createTypeOperation) {
                            let indexSelected = this.createTypeOperation.selectedIndex, options = this.createTypeOperation.querySelectorAll('option')[indexSelected];
                            let selectedId = options.getAttribute('id');
                            if (selectedId === 'one') {
                                option.style.display = 'block';
                            }
                            else {
                                option.style.display = 'none';
                            }
                            if (this.createCategoryOperation) {
                                this.createCategoryOperation.appendChild(option);
                            }
                            this.createTypeOperation.addEventListener('change', (e) => {
                                if (this.createTypeOperation && this.createCategoryOperation
                                    && this.createTypeOperation.value === 'expense') {
                                    option.style.display = 'none';
                                    this.createCategoryOperation.value = ' ';
                                }
                                else {
                                    option.style.display = 'block';
                                }
                            });
                        }
                    });
                    if (type === 'доход') {
                        result.forEach((item) => {
                            if (item.title === category && this.createCategoryOperation) {
                                this.createCategoryOperation.value = category;
                                this.category = item.id;
                                // return this.category
                            }
                        });
                    }
                    if (this.createCategoryOperation) {
                        this.createCategoryOperation.addEventListener('change', (e) => {
                            result.forEach((item) => {
                                if (item.title && this.createCategoryOperation && this.createCategoryOperation.value === item.title) {
                                    this.category = item.id;
                                    // return this.category
                                }
                            });
                        });
                    }
                }
                const resultExpense = yield custom_http_1.CustomHttp.request(config_1.default.host + '/categories/expense');
                if (type === 'доход') {
                    resultExpense.forEach((item) => {
                        if (item.title === category && this.createCategoryOperation) {
                            this.createCategoryOperation.value = item.title;
                        }
                    });
                }
                resultExpense.forEach((itemExp) => {
                    const optionExp = document.createElement('option');
                    optionExp.setAttribute('value', itemExp.title);
                    optionExp.setAttribute('id', itemExp.id.toString());
                    optionExp.className = 'option-element-exp';
                    optionExp.innerText = itemExp.title;
                    if (this.createTypeOperation) {
                        let indexSelected = this.createTypeOperation.selectedIndex, option = this.createTypeOperation.querySelectorAll('option')[indexSelected];
                        let selectedId = option.getAttribute('id');
                        if (selectedId === 'two') {
                            optionExp.style.display = 'block';
                        }
                        else {
                            optionExp.style.display = 'none';
                        }
                        if (this.createCategoryOperation) {
                            this.createCategoryOperation.appendChild(optionExp);
                        }
                        this.createTypeOperation.addEventListener('change', (e) => {
                            if (this.createTypeOperation && this.createCategoryOperation && this.createTypeOperation.value === 'income') {
                                optionExp.style.display = 'none';
                                this.createCategoryOperation.value = ' ';
                            }
                            else {
                                optionExp.style.display = 'block';
                            }
                        });
                    }
                });
                if (type === 'расход') {
                    resultExpense.forEach((item) => {
                        if (item.title === category && this.createCategoryOperation) {
                            this.createCategoryOperation.value = category;
                            this.category = item.id;
                            // return this.category
                        }
                    });
                }
                if (this.createCategoryOperation) {
                    this.createCategoryOperation.addEventListener('change', (e) => {
                        resultExpense.forEach((item) => {
                            if (item.title && this.createCategoryOperation && this.createCategoryOperation.value === item.title) {
                                this.category = item.id;
                                // return this.category
                            }
                        });
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
            this.addInputNameOperations();
            this.editOperation();
        });
    }
    addInputNameOperations() {
        let type = localStorage.getItem('Type');
        let amount = localStorage.getItem('Amount');
        let date = localStorage.getItem('Date');
        let comment = localStorage.getItem('Comment');
        if (type) {
            type = type.replace(/[^а-яёa-z]/gi, ' ');
            type = type.replace(/\s+/g, ' ').trim();
        }
        if (amount) {
            amount = amount.replace(/[^0-9]/gi, ' ');
            amount = amount.replace(/\s+/g, ' ').trim();
        }
        if (date) {
            date = date.replace(/[^0-9.]/gi, ' ');
            date = date.replace(/\s+/g, ' ').trim();
            let dateArr = date.split('.');
            date = dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0];
        }
        if (comment) {
            comment = comment.replace(/[^а-яёa-z1-9]/gi, ' ');
            comment = comment.replace(/\s+/g, ' ').trim();
        }
        if (type === 'доход' && this.createTypeOperation) {
            this.createTypeOperation.value = 'income';
        }
        else if (this.createTypeOperation) {
            this.createTypeOperation.value = 'expense';
        }
        if (this.createAmountOperation) {
            this.createAmountOperation.value = amount;
        }
        if (this.createDateOperation) {
            this.createDateOperation.value = date;
        }
        if (this.createCommentOperation) {
            this.createCommentOperation.value = comment;
        }
    }
    editOperation() {
        const that = this;
        let operationId = localStorage.getItem('OperationId');
        if (operationId) {
            JSON.parse(operationId);
            operationId = operationId.replace(/[^1-9]/gi, ' ');
            operationId = parseInt(operationId).toString();
        }
        if (this.createOperationSaveBtn) {
            this.createOperationSaveBtn.onclick = function () {
                const userInfo = auth_1.Auth.getUserInfo();
                if (!userInfo) {
                    location.href = '#/login';
                }
                if (that.createTypeOperation && that.createAmountOperation
                    && that.createDateOperation && that.createCommentOperation) {
                    try {
                        const result = custom_http_1.CustomHttp.request(config_1.default.host + '/operations/' + operationId, "PUT", {
                            type: that.createTypeOperation.value,
                            category_id: that.category,
                            amount: that.createAmountOperation.value,
                            date: that.createDateOperation.value,
                            comment: that.createCommentOperation.value
                        });
                        if (result) {
                            location.href = '#/expensesAndIncome';
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                that.removeLocalStorage();
            };
        }
    }
    removeLocalStorage() {
        localStorage.removeItem('Type');
        localStorage.removeItem('Amount');
        localStorage.removeItem('Date');
        localStorage.removeItem('Comment');
        localStorage.removeItem('Category');
        localStorage.removeItem('OperationId');
    }
}
exports.EditIncomeOrExpenses = EditIncomeOrExpenses;
//# sourceMappingURL=editIncomeOrExpenses.js.map