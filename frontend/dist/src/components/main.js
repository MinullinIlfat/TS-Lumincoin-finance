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
exports.Main = void 0;
const auth_1 = require("../services/auth");
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
class Main {
    constructor() {
        this.buttonElements = document.querySelectorAll('.button-element');
        this.collapseButtonElements = document.querySelectorAll('.collapse-button');
        this.svgElements = document.querySelectorAll('.svg-element');
        this.incomeChart = document.getElementById("incomeChart");
        this.expensesChart = document.getElementById("expensesChart");
        this.sidebarMain = document.getElementById('sidebar-main');
        this.sidebarMainText = document.getElementById('sidebar-main-text');
        this.sidebarMainSvg = document.getElementById('sidebar-main-svg');
        this.orderCollapseElement = document.getElementById('orders-collapse');
        this.categoryButtonElement = document.getElementById('category-button');
        this.categorySvgElement = document.getElementById('category-svg');
        this.sidebarCategoryElement = document.getElementById('sidebar-category');
        this.sidebarFinance = document.getElementById('sidebar-finance');
        this.sidebarFinanceText = document.getElementById('sidebar-finance-text');
        this.sidebarFinanceSvg = document.getElementById('sidebar-finance-svg');
        this.sidebarCategoryCollapseElements = document.getElementById('sidebar-category-collapse');
        this.buttonAll = document.getElementById('button-all');
        this.buttonWeek = document.getElementById('button-week');
        this.buttonMonth = document.getElementById('button-month');
        this.buttonYear = document.getElementById('button-year');
        this.buttonToday = document.getElementById('button-today');
        this.buttonInterval = document.getElementById('button-interval');
        this.buttonIntervalFrom = document.getElementById('from');
        this.buttonIntervalTo = document.getElementById('to');
        this.btns = document.querySelectorAll('.button');
        this.removeElement();
        this.inactive();
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const that = this;
            const userInfo = auth_1.Auth.getUserInfo();
            if (!userInfo) {
                location.href = '#/login';
            }
            if (this.buttonAll) {
                this.buttonAll.onclick = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/operations/?period=all');
                            if (result) {
                                that.testChart(result);
                                that.activeElement(result);
                            }
                        }
                        catch (error) {
                            console.log(error);
                        }
                    });
                };
            }
            if (this.buttonWeek) {
                this.buttonWeek.onclick = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/operations/?period=week');
                            if (result) {
                                that.testChart(result);
                                that.activeElement(result);
                            }
                        }
                        catch (error) {
                            console.log(error);
                        }
                    });
                };
            }
            if (this.buttonMonth) {
                this.buttonMonth.onclick = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/operations/?period=month');
                            if (result) {
                                that.testChart(result);
                                that.activeElement(result);
                            }
                        }
                        catch (error) {
                            console.log(error);
                        }
                    });
                };
            }
            if (this.buttonYear) {
                this.buttonYear.onclick = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/operations/?period=year');
                            if (result) {
                                that.testChart(result);
                                that.activeElement(result);
                            }
                        }
                        catch (error) {
                            console.log(error);
                        }
                    });
                };
            }
            if (this.buttonToday) {
                this.buttonToday.onclick = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/operations/?period=today');
                            if (result) {
                                that.testChart(result);
                                that.activeElement(result);
                            }
                        }
                        catch (error) {
                            console.log(error);
                        }
                    });
                };
                this.buttonToday.click();
            }
            if (this.buttonInterval) {
                this.buttonInterval.onclick = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (that.buttonIntervalFrom && that.buttonIntervalTo) {
                            let from = that.buttonIntervalFrom.value.split('/');
                            let to = that.buttonIntervalTo.value.split('/');
                            from = from[2] + '-' + from[0] + '-' + from[1];
                            to = to[2] + '-' + to[0] + '-' + to[1];
                            try {
                                const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/operations/?period=interval&dateFrom=' + from + '&dateTo=' + to);
                                if (result) {
                                    that.testChart(result);
                                    that.activeElement(result);
                                }
                            }
                            catch (error) {
                                console.log(error);
                            }
                        }
                    });
                };
            }
            $(function () {
                let dateFormat = "mm/dd/yy", from = $("#from")
                    .datepicker({
                    defaultDate: "+1w",
                    changeMonth: true,
                    numberOfMonths: 1
                })
                    .on("change", function () {
                    to.datepicker("option", "minDate", getDate(that));
                }), to = $("#to").datepicker({
                    defaultDate: "+1w",
                    changeMonth: true,
                    numberOfMonths: 1
                })
                    .on("change", function () {
                    from.datepicker("option", "maxDate", getDate(that));
                });
                function getDate(element) {
                    let date;
                    try {
                        date = $.datepicker.parseDate(dateFormat, element.value);
                    }
                    catch (error) {
                        date = null;
                    }
                    return date;
                }
            });
        });
    }
    testChart(result) {
        let expenseArrAmount = [];
        let expenseArrCategory = [];
        result.forEach((item) => {
            if (item.type === 'expense' && expenseArrAmount && expenseArrCategory) {
                expenseArrAmount.push(item.amount);
                expenseArrCategory.push(item.category);
            }
        });
        let incomeArrAmount = [];
        let incomeArrCategory = [];
        result.forEach((item) => {
            if (item.type === 'income' && incomeArrAmount && incomeArrCategory) {
                incomeArrAmount.push(item.amount);
                incomeArrCategory.push(item.category);
            }
        });
        Chart.defaults.global.defaultFontFamily = "Roboto-Medium";
        Chart.defaults.global.defaultFontSize = 12;
        Chart.defaults.global.defaultFontColor = "#000000";
        let canvasIncome = this.incomeChart;
        if (canvasIncome) {
            canvasIncome.width = 414;
            canvasIncome.height = 467;
        }
        let canvasExpenses = this.expensesChart;
        canvasExpenses.width = 414;
        canvasExpenses.height = 467;
        let incomeChartData = {
            labels: incomeArrCategory,
            datasets: [
                {
                    data: incomeArrAmount,
                    backgroundColor: [
                        "#DC3545",
                        "#FD7E14",
                        "#FFC107",
                        "#20C997",
                        "#0D6EFD",
                        "#FFC0CB",
                        "#00FFFF",
                        "#8B008B"
                    ]
                }
            ]
        };
        let incomeChartView = new Chart(this.incomeChart, {
            type: 'pie',
            data: incomeChartData
        });
        let expensesChartData = {
            labels: expenseArrCategory,
            datasets: [
                {
                    data: expenseArrAmount,
                    backgroundColor: [
                        "#DC3545",
                        "#FD7E14",
                        "#FFC107",
                        "#20C997",
                        "#0D6EFD",
                        "#FFC0CB",
                        "#00FFFF",
                        "#8B008B"
                    ]
                }
            ]
        };
        let expensesChartView = new Chart(this.expensesChart, {
            type: 'pie',
            data: expensesChartData
        });
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
            item.classList.remove('nav-link', 'rounded');
            item.classList.add('nav-item');
        });
    }
    activeElement(result) {
        // const that: Main = this
        if (this.sidebarMain) {
            this.sidebarMain.classList.add('nav-link', 'active');
        }
        if (this.sidebarMainText) {
            this.sidebarMainText.classList.add('nav-link', 'active');
            this.sidebarMainText.classList.remove('link-dark');
        }
        if (this.sidebarMainSvg) {
            this.sidebarMainSvg.style.fill = 'white';
        }
        for (let i = 0; i < this.btns.length; i++) {
            this.btns[i].addEventListener("click", function () {
                let current = document.getElementsByClassName("button active");
                if (current) {
                    current[0].className = current[0].className.replace(" active", "");
                    this.className += " active";
                }
            });
        }
        result.forEach((item) => {
            let tableItem = document.getElementById(item.id.toString());
            if (tableItem) {
                tableItem.remove();
            }
        });
    }
    inactive() {
        if (this.orderCollapseElement) {
            this.orderCollapseElement.classList.remove('show');
        }
        if (this.sidebarCategoryCollapseElements) {
            this.sidebarCategoryCollapseElements.classList.remove('nav-link', 'active');
            this.sidebarCategoryCollapseElements.classList.add('link-dark');
        }
        if (this.categoryButtonElement) {
            this.categoryButtonElement.classList.add('link-dark', 'collapsed');
            this.categoryButtonElement.classList.remove('active');
        }
        if (this.categorySvgElement) {
            this.categorySvgElement.style.fill = 'black';
        }
        if (this.sidebarCategoryElement) {
            this.sidebarCategoryElement.style.border = '0px';
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
    }
}
exports.Main = Main;
//# sourceMappingURL=main.js.map