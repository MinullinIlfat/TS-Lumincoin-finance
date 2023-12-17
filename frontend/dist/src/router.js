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
exports.Router = void 0;
const signup_1 = require("./components/signup");
const auth_1 = require("./services/auth");
const income_1 = require("./components/income");
const expenses_1 = require("./components/expenses");
const main_1 = require("./components/main");
const expensesAndIncome_1 = require("./components/expensesAndIncome");
const editCategoryIncome_1 = require("./components/editCategoryIncome");
const editCategoryExpenses_1 = require("./components/editCategoryExpenses");
const createCategoryIncome_1 = require("./components/createCategoryIncome");
const createCategoryExpenses_1 = require("./components/createCategoryExpenses");
const editIncomeOrExpenses_1 = require("./components/editIncomeOrExpenses");
const createIncomeOrExpenses_1 = require("./components/createIncomeOrExpenses");
class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.pageTitleElement = document.getElementById('title');
        this.profileFullNameElement = document.getElementById('profile-full-name');
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                styles: 'styles/index.css',
                load: () => {
                    new main_1.Main();
                }
            },
            {
                route: '#/login',
                title: 'Войти',
                template: 'templates/login.html',
                styles: 'styles/login.css',
                load: () => {
                    new signup_1.SignUp('login');
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'styles/login.css',
                load: () => {
                    new signup_1.SignUp('signup');
                }
            },
            {
                route: '#/expensesAndIncome',
                title: 'Главная',
                template: 'templates/expensesAndIncome.html',
                styles: 'styles/index.css',
                load: () => {
                    new expensesAndIncome_1.ExpensesAndIncome();
                }
            },
            {
                route: '#/income',
                title: 'Главная',
                template: 'templates/income.html',
                styles: 'styles/index.css',
                load: () => {
                    new income_1.Income();
                }
            },
            {
                route: '#/expenses',
                title: 'Главная',
                template: 'templates/expenses.html',
                styles: 'styles/index.css',
                load: () => {
                    new expenses_1.Expenses();
                }
            },
            {
                route: '#/editIncomeOrExpenses',
                title: 'Главная',
                template: 'templates/editIncomeOrExpenses.html',
                styles: 'styles/index.css',
                load: () => {
                    new editIncomeOrExpenses_1.EditIncomeOrExpenses();
                }
            },
            {
                route: '#/createIncomeOrExpenses',
                title: 'Главная',
                template: 'templates/createIncomeOrExpenses.html',
                styles: 'styles/index.css',
                load: () => {
                    new createIncomeOrExpenses_1.CreateIncomeOrExpenses();
                }
            },
            {
                route: '#/editCategoryIncome',
                title: 'Главная',
                template: 'templates/editCategoryIncome.html',
                styles: 'styles/index.css',
                load: () => {
                    new editCategoryIncome_1.EditCategoryIncome();
                }
            },
            {
                route: '#/createCategoryIncome',
                title: 'Главная',
                template: 'templates/createCategoryIncome.html',
                styles: 'styles/index.css',
                load: () => {
                    new createCategoryIncome_1.CreateCategoryIncome();
                }
            },
            {
                route: '#/editCategoryExpenses',
                title: 'Главная',
                template: 'templates/editCategoryExpenses.html',
                styles: 'styles/index.css',
                load: () => {
                    new editCategoryExpenses_1.EditCategoryExpenses();
                }
            },
            {
                route: '#/createCategoryExpenses',
                title: 'Главная',
                template: 'templates/createCategoryExpenses.html',
                styles: 'styles/index.css',
                load: () => {
                    new createCategoryExpenses_1.CreateCategoryExpenses();
                }
            },
        ];
    }
    openRoute() {
        return __awaiter(this, void 0, void 0, function* () {
            const urlRoute = window.location.hash.split('?')[0];
            if (urlRoute === '#/logout') {
                auth_1.Auth.removeTokens();
                localStorage.removeItem(auth_1.Auth.userInfoKey);
                localStorage.removeItem('email');
                window.location.href = '#/login';
                return;
            }
            const newRoute = this.routes.find((item) => {
                return item.route === urlRoute;
            });
            if (!newRoute) {
                window.location.href = '#/login';
                return;
            }
            if (!this.contentElement || !this.stylesElement
                || !this.pageTitleElement || !this.profileFullNameElement) {
                if (urlRoute === '#/login') {
                    return;
                }
                else {
                    window.location.href = '#/login';
                    return;
                }
            }
            this.contentElement.innerHTML =
                yield fetch(newRoute.template).then(response => response.text());
            this.stylesElement.setAttribute('href', newRoute.styles);
            this.pageTitleElement.innerText = newRoute.title;
            const userInfo = auth_1.Auth.getUserInfo();
            const accessToken = localStorage.getItem(auth_1.Auth.accessTokenKey);
            if (userInfo && accessToken) {
                this.profileFullNameElement.innerText = userInfo.fullName;
            }
            newRoute.load();
        });
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map