import {SignUp} from "./components/signup";
import {Auth} from "./services/auth";
import {Income} from "./components/income";
import {Expenses} from "./components/expenses";
import {Main} from "./components/main";
import {ExpensesAndIncome} from "./components/expensesAndIncome";
import {EditCategoryIncome} from "./components/editCategoryIncome";
import {EditCategoryExpenses} from "./components/editCategoryExpenses";
import {CreateCategoryIncome} from "./components/createCategoryIncome";
import {CreateCategoryExpenses} from "./components/createCategoryExpenses";
import {EditIncomeOrExpenses} from "./components/editIncomeOrExpenses";
import {CreateIncomeOrExpenses} from "./components/createIncomeOrExpenses";
import {RouteType} from "./types/route.type";
import {UserInfoType} from "./types/user-info.type";

export class Router {
    readonly contentElement: HTMLElement | null;
    readonly stylesElement: HTMLElement | null;
    readonly pageTitleElement: HTMLElement | null;
    readonly profileFullNameElement: HTMLElement | null;

    private routes: RouteType[];

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
                    new Main();
                }
            },
            {
                route: '#/login',
                title: 'Войти',
                template: 'templates/login.html',
                styles: 'styles/login.css',
                load: () => {
                    new SignUp('login');
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'styles/login.css',
                load: () => {
                    new SignUp('signup');
                }
            },
            {
                route: '#/expensesAndIncome',
                title: 'Главная',
                template: 'templates/expensesAndIncome.html',
                styles: 'styles/index.css',
                load: () => {
                    new ExpensesAndIncome();
                }
            },
            {
                route: '#/income',
                title: 'Главная',
                template: 'templates/income.html',
                styles: 'styles/index.css',
                load: () => {
                    new Income();
                }
            },
            {
                route: '#/expenses',
                title: 'Главная',
                template: 'templates/expenses.html',
                styles: 'styles/index.css',
                load: () => {
                    new Expenses();
                }
            },
            {
                route: '#/editIncomeOrExpenses',
                title: 'Главная',
                template: 'templates/editIncomeOrExpenses.html',
                styles: 'styles/index.css',
                load: () => {
                    new EditIncomeOrExpenses();
                }
            },
            {
                route: '#/createIncomeOrExpenses',
                title: 'Главная',
                template: 'templates/createIncomeOrExpenses.html',
                styles: 'styles/index.css',
                load: () => {
                    new CreateIncomeOrExpenses();
                }
            },
            {
                route: '#/editCategoryIncome',
                title: 'Главная',
                template: 'templates/editCategoryIncome.html',
                styles: 'styles/index.css',
                load: () => {
                    new EditCategoryIncome();
                }
            },
            {
                route: '#/createCategoryIncome',
                title: 'Главная',
                template: 'templates/createCategoryIncome.html',
                styles: 'styles/index.css',
                load: () => {
                    new CreateCategoryIncome();
                }
            },
            {
                route: '#/editCategoryExpenses',
                title: 'Главная',
                template: 'templates/editCategoryExpenses.html',
                styles: 'styles/index.css',
                load: () => {
                    new EditCategoryExpenses();
                }
            },
            {
                route: '#/createCategoryExpenses',
                title: 'Главная',
                template: 'templates/createCategoryExpenses.html',
                styles: 'styles/index.css',
                load: () => {
                    new CreateCategoryExpenses();
                }
            },
        ]
    }

    public async openRoute():Promise<void> {
        const urlRoute: string = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            Auth.removeTokens();
            localStorage.removeItem(Auth.userInfoKey);
            localStorage.removeItem('email');
            window.location.href = '#/login';
            return;
        }

        const newRoute: RouteType | undefined = this.routes.find((item: any) => {
            return item.route === urlRoute;
        })

        if (!newRoute) {
            window.location.href = '#/login';
            return;
        }

        if (!this.contentElement || !this.stylesElement
            || !this.pageTitleElement || !this.profileFullNameElement) {
            if (urlRoute === '#/login') {
                return;
            } else {
                window.location.href = '#/login';
                return;
            }
        }

        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        this.stylesElement.setAttribute('href', newRoute.styles);
        this.pageTitleElement.innerText = newRoute.title;

        const userInfo: UserInfoType | null = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            this.profileFullNameElement.innerText = userInfo.fullName;
        }
        newRoute.load();
    }
}