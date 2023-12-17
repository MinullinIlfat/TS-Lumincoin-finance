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
exports.ExpensesAndIncome = void 0;
const auth_1 = require("../services/auth");
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
class ExpensesAndIncome {
    constructor() {
        this.buttonElements = document.querySelectorAll('.button-element');
        this.svgElements = document.querySelectorAll('.svg-element');
        this.collapseButtonElements = document.querySelectorAll('.collapse-button');
        this.sidebarFinance = document.getElementById('sidebar-finance');
        this.sidebarFinanceText = document.getElementById('sidebar-finance-text');
        this.sidebarFinanceSvg = document.getElementById('sidebar-finance-svg');
        this.orderCollapseElement = document.getElementById('orders-collapse');
        this.categoryButtonElement = document.getElementById('category-button');
        this.categorySvgElement = document.getElementById('category-svg');
        this.sidebarCategoryElement = document.getElementById('sidebar-category');
        this.sidebarMain = document.getElementById('sidebar-main');
        this.sidebarMainText = document.getElementById('sidebar-main-text');
        this.sidebarMainSvg = document.getElementById('sidebar-main-svg');
        this.sidebarCategoryCollapseElements = document.getElementById('sidebar-category-collapse');
        this.popupExpAndInc = document.getElementById('popup-expense-and-income');
        this.popupDeleteOperation = document.getElementById('popup-delete-operation');
        this.buttonAll = document.getElementById('button-all');
        this.buttonWeek = document.getElementById('button-week');
        this.buttonMonth = document.getElementById('button-month');
        this.buttonYear = document.getElementById('button-year');
        this.buttonToday = document.getElementById('button-today');
        this.buttonInterval = document.getElementById('button-interval');
        this.buttonIntervalFrom = document.getElementById('from');
        this.buttonIntervalTo = document.getElementById('to');
        this.btns = document.querySelectorAll('.button');
        this.tableBody = document.getElementById('table-body');
        this.removeElement();
        this.inactive();
        this.activeElement();
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
                                that.showTableElements(result);
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
                                that.showTableElements(result);
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
                                that.showTableElements(result);
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
                                that.showTableElements(result);
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
                                that.showTableElements(result);
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
                                    that.showTableElements(result);
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
    activeElement() {
        if (this.sidebarFinance) {
            this.sidebarFinance.classList.add('nav-link', 'active');
        }
        if (this.sidebarFinanceText) {
            this.sidebarFinanceText.classList.add('nav-link', 'active');
            this.sidebarFinanceText.classList.remove('link-dark');
        }
        if (this.sidebarFinanceSvg) {
            this.sidebarFinanceSvg.style.fill = 'white';
        }
        for (let i = 0; i < this.btns.length; i++) {
            this.btns[i].addEventListener("click", function () {
                let current = document.getElementsByClassName("button active");
                current[0].className = current[0].className.replace(" active", "");
                this.className += " active";
                //скопированный код
            });
        }
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
    showTableElements(result) {
        const that = this;
        let counter = 1;
        result.forEach((item) => {
            for (let i = 0; i < this.btns.length; i++) {
                this.btns[i].addEventListener("click", function () {
                    let tableItems = document.getElementById(item.id.toString());
                    if (tableItems) {
                        tableItems.remove();
                    }
                });
            }
            const tableItem = document.createElement('tr');
            tableItem.setAttribute('id', item.id.toString());
            tableItem.className = 'tr-item';
            const tableItemScope = document.createElement('th');
            tableItemScope.setAttribute('scope', 'row');
            tableItemScope.innerText = counter.toString();
            const tableItemType = document.createElement('td');
            tableItemType.className = 'row-name-green';
            if (item.type === 'income' || item.type === 'доход') {
                item.type = 'доход';
                tableItemType.className = 'row-name-green';
            }
            else if (item.type === 'expense' || item.type === 'расход') {
                item.type = 'расход';
                tableItemType.className = 'row-name-red';
            }
            tableItemType.innerText = item.type;
            const tableItemCategory = document.createElement('td');
            tableItemCategory.innerText = item.category;
            const tableItemAmount = document.createElement('td');
            tableItemAmount.innerText = item.amount + '$';
            let str = item.date.toString();
            let arr = str.split('-');
            let res = arr[2] + '.' + arr[1] + '.' + arr[0];
            const tableItemDate = document.createElement('td');
            tableItemDate.innerText = res;
            const tableItemComment = document.createElement('td');
            tableItemComment.innerText = item.comment;
            const tableItemButton = document.createElement('td');
            const tableItemButtonElement = document.createElement('button');
            tableItemButtonElement.className = 'btn-svg delete-btn';
            tableItemButtonElement.innerHTML =
                '<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">' +
                    '<path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z" fill="black"/>' +
                    '<path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z" fill="black"/>' +
                    '<path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z" fill="black"/>' +
                    '<path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z" fill="black"/>' +
                    '</svg>';
            const tableItemButtonCreate = document.createElement('a');
            tableItemButtonCreate.setAttribute('href', '#/editIncomeOrExpenses');
            tableItemButtonCreate.className = 'edit-operation';
            const tableItemButtonCreateImg = document.createElement("img");
            tableItemButtonCreateImg.src = "images/iconPen.png";
            tableItem.appendChild(tableItemScope);
            tableItem.appendChild(tableItemType);
            tableItem.appendChild(tableItemCategory);
            tableItem.appendChild(tableItemAmount);
            tableItem.appendChild(tableItemDate);
            tableItem.appendChild(tableItemComment);
            tableItemButtonCreate.appendChild(tableItemButtonCreateImg);
            tableItemButton.appendChild(tableItemButtonElement);
            tableItemButton.appendChild(tableItemButtonCreate);
            tableItem.appendChild(tableItemButton);
            if (this.tableBody) {
                this.tableBody.appendChild(tableItem);
            }
            const editOperationElements = document.querySelectorAll('.edit-operation');
            editOperationElements.forEach((item) => {
                item.onclick = function () {
                    const type = item.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
                    const category = item.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
                    const amount = item.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
                    const date = item.parentElement.previousElementSibling.previousElementSibling.textContent;
                    const comment = item.parentElement.previousElementSibling.textContent;
                    const operationId = item.parentElement.parentElement.id;
                    localStorage.setItem('Type', JSON.stringify(type));
                    localStorage.setItem('Category', JSON.stringify(category));
                    localStorage.setItem('Amount', JSON.stringify(amount));
                    localStorage.setItem('Date', JSON.stringify(date));
                    localStorage.setItem('Comment', JSON.stringify(comment));
                    localStorage.setItem('OperationId', JSON.stringify(operationId));
                };
            });
            const deleteBtnElement = document.querySelectorAll('.delete-btn');
            deleteBtnElement.forEach((item) => {
                item.onclick = function () {
                    if (that.popupExpAndInc) {
                        that.popupExpAndInc.style.display = 'grid';
                    }
                    if (that.popupDeleteOperation) {
                        that.popupDeleteOperation.onclick = function () {
                            let resultId = item.parentElement.parentElement.id;
                            try {
                                const result = custom_http_1.CustomHttp.request(config_1.default.host + '/operations/' + resultId, "DELETE");
                                if (result) {
                                    location.href = '#/expensesAndIncome';
                                }
                            }
                            catch (error) {
                                console.log(error);
                            }
                        };
                    }
                };
            });
            counter += 1;
        });
    }
}
exports.ExpensesAndIncome = ExpensesAndIncome;
//# sourceMappingURL=expensesAndIncome.js.map