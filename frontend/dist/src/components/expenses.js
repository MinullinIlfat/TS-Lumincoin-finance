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
exports.Expenses = void 0;
const auth_1 = require("../services/auth");
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
class Expenses {
    constructor() {
        this.expensesElement = document.getElementById('expenses');
        this.incomeElement = document.getElementById('income');
        this.expensesTextElement = document.getElementById('expenses-text');
        this.incomeTextElement = document.getElementById('income-text');
        this.categoryButtonElement = document.getElementById('category-button');
        this.sidebarCategoryElement = document.getElementById('sidebar-category');
        this.orderCollapseElement = document.getElementById('orders-collapse');
        this.categorySvgElement = document.getElementById('category-svg');
        this.buttonElements = document.querySelectorAll('.button-element');
        this.sidebarCategoryCollapseElements = document.getElementById('sidebar-category-collapse');
        this.collapseButtonElements = document.querySelectorAll('.collapse-button');
        this.svgElements = document.querySelectorAll('.svg-element');
        this.sidebarFinance = document.getElementById('sidebar-finance');
        this.sidebarFinanceText = document.getElementById('sidebar-finance-text');
        this.sidebarFinanceSvg = document.getElementById('sidebar-finance-svg');
        this.sidebarMain = document.getElementById('sidebar-main');
        this.sidebarMainText = document.getElementById('sidebar-main-text');
        this.sidebarMainSvg = document.getElementById('sidebar-main-svg');
        this.popupExpenses = document.getElementById('popup-expenses');
        this.removeElement();
        this.inactive();
        this.activeElement();
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = auth_1.Auth.getUserInfo();
            if (!userInfo) {
                location.href = '#/login';
            }
            try {
                const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/categories/expense');
                if (result) {
                    this.showExpenseElements(result);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    showExpenseElements(result) {
        const categoryItems = document.getElementById('category-expense-items');
        if (categoryItems) {
            result.forEach((item) => {
                const categoryItem = document.createElement('div');
                categoryItem.className = 'category-item';
                categoryItem.setAttribute('id', item.id.toString());
                const categoryItemName = document.createElement('div');
                categoryItemName.className = 'category-item-name';
                categoryItemName.innerText = item.title;
                const categoryItemActive = document.createElement('div');
                categoryItemActive.className = 'category-item-active';
                const editBtnIncome = document.createElement('a');
                editBtnIncome.setAttribute('href', '#/editCategoryExpenses');
                editBtnIncome.className = 'edit-btn-expenses btn btn-primary me-2';
                editBtnIncome.innerText = 'Редактировать';
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn btn btn-danger';
                deleteBtn.innerText = 'Удалить';
                categoryItemActive.appendChild(editBtnIncome);
                categoryItemActive.appendChild(deleteBtn);
                categoryItem.appendChild(categoryItemName);
                categoryItem.appendChild(categoryItemActive);
                categoryItems.appendChild(categoryItem);
            });
            const categoryItemAdd = document.createElement('a');
            categoryItemAdd.className = 'category-item category-item-add d-flex justify-content-center align-items-center';
            categoryItemAdd.setAttribute('href', '#/createCategoryExpenses');
            categoryItemAdd.innerText = '+';
            categoryItems.appendChild(categoryItemAdd);
            const editBtnElements = document.querySelectorAll('.edit-btn-expenses');
            editBtnElements.forEach((item) => {
                item.onclick = function () {
                    const result = item.parentElement.previousElementSibling.textContent;
                    const resultId = item.parentElement.parentElement.id;
                    localStorage.setItem('BlockName', JSON.stringify(result));
                    localStorage.setItem('BlockId', JSON.stringify(resultId));
                };
            });
            const deleteBtnElement = document.querySelectorAll('.delete-btn');
            const popupDeleteCategory = document.getElementById('popup-delete-category-expense');
            const that = this;
            deleteBtnElement.forEach((item) => {
                item.onclick = function () {
                    if (that.popupExpenses) {
                        that.popupExpenses.style.display = 'grid';
                    }
                    if (popupDeleteCategory) {
                        popupDeleteCategory.onclick = function () {
                            let resultId = item.parentElement.parentElement.id;
                            try {
                                const result = custom_http_1.CustomHttp.request(config_1.default.host + '/categories/expense/' + resultId, "DELETE");
                                if (result) {
                                    location.href = '#/expenses';
                                }
                            }
                            catch (error) {
                                console.log(error);
                            }
                        };
                    }
                };
            });
        }
    }
    removeElement() {
        this.buttonElements.forEach(item => {
            item.classList.remove('active');
            item.classList.add('link-dark');
        });
        this.svgElements.forEach((item) => {
            item.style.setProperty("fill", "black", "important");
        });
        this.collapseButtonElements.forEach(item => {
            item.classList.remove('nav-link');
        });
        localStorage.removeItem('BlockName');
        localStorage.removeItem('BlockId');
    }
    activeElement() {
        if (this.expensesElement) {
            this.expensesElement.classList.remove('link-dark');
            this.expensesElement.classList.add('nav-link', 'active');
            this.expensesElement.style.borderRadius = '0px';
            this.expensesElement.style.borderBottomLeftRadius = '5px';
            this.expensesElement.style.borderBottomRightRadius = '5px';
        }
        if (this.sidebarCategoryCollapseElements) {
            this.sidebarCategoryCollapseElements.classList.add('nav-link', 'active');
            this.sidebarCategoryCollapseElements.style.borderRadius = '0px';
            this.sidebarCategoryCollapseElements.style.borderTopLeftRadius = '5px';
            this.sidebarCategoryCollapseElements.style.borderTopRightRadius = '5px';
        }
        if (this.categoryButtonElement) {
            this.categoryButtonElement.classList.remove('link-dark', 'collapsed');
            this.categoryButtonElement.classList.add('nav-link', 'active');
        }
        if (this.expensesTextElement) {
            this.expensesTextElement.classList.remove('link-dark');
            this.expensesTextElement.classList.add('nav-link', 'active');
        }
        if (this.orderCollapseElement) {
            this.orderCollapseElement.classList.add('show');
        }
        if (this.categorySvgElement) {
            this.categorySvgElement.style.fill = 'white';
        }
        if (this.sidebarCategoryElement) {
            this.sidebarCategoryElement.style.border = '1px solid #0D6EFD';
            this.sidebarCategoryElement.style.borderRadius = '5px';
        }
    }
    inactive() {
        if (this.incomeElement) {
            this.incomeElement.style.borderRadius = '0px';
        }
        if (this.incomeTextElement) {
            this.incomeTextElement.classList.remove('link-dark');
        }
        if (this.sidebarFinance) {
            this.sidebarFinance.classList.remove('nav-link', 'active');
        }
        if (this.sidebarFinanceText) {
            this.sidebarFinanceText.classList.remove('active');
            this.sidebarFinanceText.classList.add('link-dark');
        }
        if (this.sidebarFinanceSvg) {
            this.sidebarFinanceSvg.style.fill = 'black';
        }
        if (this.sidebarMain) {
            this.sidebarMain.classList.remove('nav-link', 'active');
        }
        if (this.sidebarMainText) {
            this.sidebarMainText.classList.remove('active');
            this.sidebarMainText.classList.add('link-dark');
        }
        if (this.sidebarMainSvg) {
            this.sidebarMainSvg.style.fill = 'black';
        }
    }
}
exports.Expenses = Expenses;
//# sourceMappingURL=expenses.js.map