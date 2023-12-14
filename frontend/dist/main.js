(() => {
    "use strict";
    const e = "http://localhost:3000/api";

    class t {
        static accessTokenKey = "accessToken";
        static refreshTokenKey = "refreshToken";
        static userInfoKey = "userInfo";

        static async processUnauthorizedResponse() {
            const t = localStorage.getItem(this.refreshTokenKey);
            if (t) {
                const n = await fetch(e + "/refresh", {
                    method: "POST",
                    headers: {"Content-type": "application/json", Accept: "application/json"},
                    body: JSON.stringify({refreshToken: t})
                });
                if (n && 200 === n.status) {
                    const e = await n.json();
                    if (e && !e.error) return this.setTokens(e.tokens.accessToken, e.tokens.refreshToken), !0
                }
            }
            return this.removeTokens(), location.href = "#/login", !1
        }

        static setTokens(e, t) {
            localStorage.setItem(this.accessTokenKey, e), localStorage.setItem(this.refreshTokenKey, t)
        }

        static removeTokens() {
            localStorage.removeItem(this.accessTokenKey), localStorage.removeItem(this.refreshTokenKey)
        }

        static setUserInfo(e) {
            localStorage.setItem(this.userInfoKey, JSON.stringify(e))
        }

        static getUserInfo() {
            const e = localStorage.getItem(this.userInfoKey);
            return e ? JSON.parse(e) : null
        }
    }

    class n {
        static async request(e, n = "GET", s = null) {
            const a = {method: n, headers: {"Content-type": "application/json", Accept: "application/json"}};
            let i = localStorage.getItem(t.accessTokenKey);
            i && (a.headers["x-auth-token"] = i), s && (a.body = JSON.stringify(s));
            const o = await fetch(e, a);
            if (o.status < 200 || o.status >= 300) {
                if (401 === o.status) return await t.processUnauthorizedResponse() ? await this.request(e, n, s) : null;
                throw new Error(o.message)
            }
            return await o.json()
        }
    }

    class s {
        constructor(e) {
            this.processElement = null, this.agreeElement = null, this.page = e, this.processElement = null, this.fields = [{
                name: "email",
                id: "email",
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: !1
            }, {
                name: "password",
                id: "password",
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: !1
            }], "signup" === this.page && this.fields.unshift({
                name: "name",
                id: "name",
                element: null,
                regex: /^[А-Я][а-я]+\s*$/,
                valid: !1
            }, {
                name: "confirm-password",
                id: "confirm-password",
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: !1
            });
            const t = this;
            this.fields.forEach((e => {
                e.element = document.getElementById(e.id), e.element.onchange = function () {
                    t.validateField.call(t, e, this)
                }
            })), this.processElement = document.getElementById("process"), this.processElement.onclick = function () {
                t.processForm()
            }, "login" === this.page && (this.agreeElement = document.getElementById("flexCheckDefault"), this.agreeElement.onchange = function () {
                t.validateForm()
            })
        }

        validateField(e, t) {
            t.value && t.value.match(e.regex) ? (t.removeAttribute("style"), e.valid = !0) : (t.style.setProperty("border", "1px solid red", "important"), e.valid = !1), this.validateForm()
        }

        validateForm() {
            const e = document.getElementById("confirm-password"), t = document.getElementById("password"),
                n = this.fields.every((e => e.valid)), s = this.agreeElement ? this.agreeElement.checked && n : n;
            return s ? this.processElement.removeAttribute("disabled") : this.processElement.setAttribute("disabled", "disabled"), "signup" === this.page && (e.value !== t.value ? (t.style.setProperty("border", "1px solid red", "important"), e.style.setProperty("border", "1px solid red", "important"), this.processElement.setAttribute("disabled", "disabled")) : (t.removeAttribute("style"), e.removeAttribute("style"), this.processElement.removeAttribute("disabled"))), s
        }

        async processForm() {
            if (this.validateForm()) {
                const s = this.fields.find((e => "email" === e.name)).element.value,
                    a = this.fields.find((e => "password" === e.name)).element.value;
                if ("signup" === this.page) {
                    const t = this.fields.find((e => "confirm-password" === e.name)).element.value;
                    try {
                        const i = await n.request(e + "/signup", "POST", {
                            name: this.fields.find((e => "name" === e.name)).element.value,
                            lastName: this.fields.find((e => "name" === e.name)).element.value,
                            email: s,
                            password: a,
                            passwordRepeat: t
                        });
                        i && (i.user || console.log(123))
                    } catch (e) {
                        return console.log(e)
                    }
                }
                try {
                    const i = await n.request(e + "/login", "POST", {email: s, password: a});
                    i && (i.tokens.accessToken && i.tokens.refreshToken && i.user.name && i.user.id && i.user.lastName || console.log("ошибка"), t.setTokens(i.tokens.accessToken, i.tokens.refreshToken), t.setUserInfo({
                        fullName: i.user.name,
                        userId: i.user.id
                    }), location.href = "#/")
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    class a {
        constructor() {
            this.incomeElement = document.getElementById("income"), this.incomeTextElement = document.getElementById("income-text"), this.expensesElement = document.getElementById("expenses"), this.expensesTextElement = document.getElementById("expenses-text"), this.sidebarCategoryElement = document.getElementById("sidebar-category"), this.categoryButtonElement = document.getElementById("category-button"), this.orderCollapseElement = document.getElementById("orders-collapse"), this.categorySvgElement = document.getElementById("category-svg"), this.sidebarCategoryCollapseElements = document.getElementById("sidebar-category-collapse"), this.buttonElements = document.querySelectorAll(".button-element"), this.collapseButtonElements = document.querySelectorAll(".collapse-button"), this.svgElements = document.querySelectorAll(".svg-element"), this.sidebarFinance = document.getElementById("sidebar-finance"), this.sidebarFinanceText = document.getElementById("sidebar-finance-text"), this.sidebarFinanceSvg = document.getElementById("sidebar-finance-svg"), this.sidebarMain = document.getElementById("sidebar-main"), this.sidebarMainText = document.getElementById("sidebar-main-text"), this.ssidebarMainSvg = document.getElementById("sidebar-main-svg"), this.popupIncome = document.getElementById("popup-income"), this.removeElement(), this.inactive(), this.activeElement(), this.init()
        }

        async init() {
            t.getUserInfo() || (location.href = "#/login");
            try {
                const t = await n.request(e + "/categories/income");
                t && this.showIncomeElements(t)
            } catch (e) {
                console.log(e)
            }
        }

        showIncomeElements(t) {
            const s = document.getElementById("category-income-items");
            t.forEach((e => {
                const t = document.createElement("div");
                t.className = "category-item", t.setAttribute("id", e.id);
                const n = document.createElement("div");
                n.className = "category-item-name", n.innerText = e.title;
                const a = document.createElement("div");
                a.className = "category-item-active";
                const i = document.createElement("a");
                i.setAttribute("href", "#/editCategoryIncome"), i.className = "edit-btn-income btn btn-primary me-2", i.innerText = "Редактировать";
                const o = document.createElement("button");
                o.className = "delete-btn btn btn-danger", o.innerText = "Удалить", a.appendChild(i), a.appendChild(o), t.appendChild(n), t.appendChild(a), s.appendChild(t)
            }));
            const a = document.createElement("a");
            a.className = "category-item category-item-add d-flex justify-content-center align-items-center", a.setAttribute("href", "#/createCategoryIncome"), a.innerText = "+", s.appendChild(a), this.editBtnElements = document.querySelectorAll(".edit-btn-income"), this.editBtnElements.forEach((e => {
                e.onclick = function () {
                    const t = e.parentElement.previousElementSibling.textContent, n = e.parentElement.parentElement.id;
                    localStorage.setItem("BlockName", JSON.stringify(t)), localStorage.setItem("BlockId", JSON.stringify(n))
                }
            })), this.deleteBtnElement = document.querySelectorAll(".delete-btn"), this.popupDeleteCategory = document.getElementById("popup-delete-category-income");
            const i = this;
            this.deleteBtnElement.forEach((t => {
                t.onclick = function () {
                    i.popupIncome.style.display = "grid", i.popupDeleteCategory.onclick = function () {
                        let s = t.parentElement.parentElement.id;
                        try {
                            n.request(e + "/categories/income/" + s, "DELETE") && (location.href = "#/income")
                        } catch (e) {
                            console.log(e)
                        }
                    }
                }
            }))
        }

        removeElement() {
            this.buttonElements.forEach((e => {
                e.classList.remove("active"), e.classList.add("link-dark")
            })), this.svgElements.forEach((e => {
                e.style.setProperty("fill", "black", "important")
            })), this.collapseButtonElements.forEach((e => {
                e.classList.remove("nav-link", "rounded")
            })), localStorage.removeItem("BlockName"), localStorage.removeItem("BlockId")
        }

        activeElement() {
            this.incomeElement.classList.remove("link-dark"), this.incomeElement.classList.add("nav-link", "active"), this.incomeElement.style.borderRadius = "0px", this.categoryButtonElement.classList.remove("link-dark", "collapsed"), this.categoryButtonElement.classList.add("nav-link", "active"), this.incomeTextElement.classList.remove("link-dark"), this.incomeTextElement.classList.add("nav-link", "active"), this.orderCollapseElement.classList.add("show"), this.categorySvgElement.style.fill = "white", this.sidebarCategoryCollapseElements.classList.add("nav-link", "active"), this.sidebarCategoryCollapseElements.style.borderRadius = "0px", this.sidebarCategoryCollapseElements.style.borderTopLeftRadius = "5px", this.sidebarCategoryCollapseElements.style.borderTopRightRadius = "5px", this.sidebarCategoryElement.style.border = "1px solid #0D6EFD", this.sidebarCategoryElement.style.borderRadius = "5px"
        }

        inactive() {
            this.expensesTextElement.classList.remove("link-dark"), this.expensesElement.style.borderRadius = "0px", this.expensesElement.style.borderBottomLeftRadius = "5px", this.expensesElement.style.borderBottomRightRadius = "5px", this.sidebarFinance.classList.remove("nav-link", "active"), this.sidebarFinanceText.classList.remove("active"), this.sidebarFinanceText.classList.add("link-dark"), this.sidebarFinanceSvg.style.fill = "black", this.sidebarMain.classList.remove("nav-link", "active"), this.sidebarMainText.classList.remove("active"), this.sidebarMainText.classList.add("link-dark"), this.ssidebarMainSvg.style.fill = "black"
        }
    }

    class i {
        constructor() {
            this.expensesElement = document.getElementById("expenses"), this.incomeElement = document.getElementById("income"), this.expensesTextElement = document.getElementById("expenses-text"), this.incomeTextElement = document.getElementById("income-text"), this.categoryButtonElement = document.getElementById("category-button"), this.sidebarCategoryElement = document.getElementById("sidebar-category"), this.orderCollapseElement = document.getElementById("orders-collapse"), this.categorySvgElement = document.getElementById("category-svg"), this.buttonElements = document.querySelectorAll(".button-element"), this.sidebarCategoryCollapseElements = document.getElementById("sidebar-category-collapse"), this.collapseButtonElements = document.querySelectorAll(".collapse-button"), this.svgElements = document.querySelectorAll(".svg-element"), this.sidebarFinance = document.getElementById("sidebar-finance"), this.sidebarFinanceText = document.getElementById("sidebar-finance-text"), this.sidebarFinanceSvg = document.getElementById("sidebar-finance-svg"), this.sidebarMain = document.getElementById("sidebar-main"), this.sidebarMainText = document.getElementById("sidebar-main-text"), this.ssidebarMainSvg = document.getElementById("sidebar-main-svg"), this.popupExpenses = document.getElementById("popup-expenses"), this.removeElement(), this.inactive(), this.activeElement(), this.init()
        }

        async init() {
            t.getUserInfo() || (location.href = "#/login");
            try {
                const t = await n.request(e + "/categories/expense");
                t && this.showExpenseElements(t)
            } catch (e) {
                console.log(e)
            }
        }

        showExpenseElements(t) {
            const s = document.getElementById("category-expense-items");
            t.forEach((e => {
                const t = document.createElement("div");
                t.className = "category-item", t.setAttribute("id", e.id);
                const n = document.createElement("div");
                n.className = "category-item-name", n.innerText = e.title;
                const a = document.createElement("div");
                a.className = "category-item-active";
                const i = document.createElement("a");
                i.setAttribute("href", "#/editCategoryExpenses"), i.className = "edit-btn-expenses btn btn-primary me-2", i.innerText = "Редактировать";
                const o = document.createElement("button");
                o.className = "delete-btn btn btn-danger", o.innerText = "Удалить", a.appendChild(i), a.appendChild(o), t.appendChild(n), t.appendChild(a), s.appendChild(t)
            }));
            const a = document.createElement("a");
            a.className = "category-item category-item-add d-flex justify-content-center align-items-center", a.setAttribute("href", "#/createCategoryExpenses"), a.innerText = "+", s.appendChild(a), this.editBtnElements = document.querySelectorAll(".edit-btn-expenses"), this.editBtnElements.forEach((e => {
                e.onclick = function () {
                    const t = e.parentElement.previousElementSibling.textContent, n = e.parentElement.parentElement.id;
                    localStorage.setItem("BlockName", JSON.stringify(t)), localStorage.setItem("BlockId", JSON.stringify(n))
                }
            })), this.deleteBtnElement = document.querySelectorAll(".delete-btn"), this.popupDeleteCategory = document.getElementById("popup-delete-category-expense");
            const i = this;
            this.deleteBtnElement.forEach((t => {
                t.onclick = function () {
                    i.popupExpenses.style.display = "grid", i.popupDeleteCategory.onclick = function () {
                        let s = t.parentElement.parentElement.id;
                        try {
                            n.request(e + "/categories/expense/" + s, "DELETE") && (location.href = "#/expenses")
                        } catch (e) {
                            console.log(e)
                        }
                    }
                }
            }))
        }

        removeElement() {
            this.buttonElements.forEach((e => {
                e.classList.remove("active"), e.classList.add("link-dark")
            })), this.svgElements.forEach((e => {
                e.style.setProperty("fill", "black", "important")
            })), this.collapseButtonElements.forEach((e => {
                e.classList.remove("nav-link")
            })), localStorage.removeItem("BlockName"), localStorage.removeItem("BlockId")
        }

        activeElement() {
            this.expensesElement.classList.remove("link-dark"), this.expensesElement.classList.add("nav-link", "active"), this.expensesElement.style.borderRadius = "0px", this.expensesElement.style.borderBottomLeftRadius = "5px", this.expensesElement.style.borderBottomRightRadius = "5px", this.sidebarCategoryCollapseElements.classList.add("nav-link", "active"), this.sidebarCategoryCollapseElements.style.borderRadius = "0px", this.sidebarCategoryCollapseElements.style.borderTopLeftRadius = "5px", this.sidebarCategoryCollapseElements.style.borderTopRightRadius = "5px", this.categoryButtonElement.classList.remove("link-dark", "collapsed"), this.categoryButtonElement.classList.add("nav-link", "active"), this.expensesTextElement.classList.remove("link-dark"), this.expensesTextElement.classList.add("nav-link", "active"), this.orderCollapseElement.classList.add("show"), this.categorySvgElement.style.fill = "white", this.sidebarCategoryElement.style.border = "1px solid #0D6EFD", this.sidebarCategoryElement.style.borderRadius = "5px"
        }

        inactive() {
            this.incomeElement.style.borderRadius = "0px", this.incomeTextElement.classList.remove("link-dark"), this.sidebarFinance.classList.remove("nav-link", "active"), this.sidebarFinanceText.classList.remove("active"), this.sidebarFinanceText.classList.add("link-dark"), this.sidebarFinanceSvg.style.fill = "black", this.sidebarMain.classList.remove("nav-link", "active"), this.sidebarMainText.classList.remove("active"), this.sidebarMainText.classList.add("link-dark"), this.ssidebarMainSvg.style.fill = "black"
        }
    }

    class o {
        constructor() {
            this.buttonElements = document.querySelectorAll(".button-element"), this.collapseButtonElements = document.querySelectorAll(".collapse-button"), this.svgElements = document.querySelectorAll(".svg-element"), this.incomeChart = document.getElementById("incomeChart"), this.expensesChart = document.getElementById("expensesChart"), this.sidebarMain = document.getElementById("sidebar-main"), this.sidebarMainText = document.getElementById("sidebar-main-text"), this.ssidebarMainSvg = document.getElementById("sidebar-main-svg"), this.orderCollapseElement = document.getElementById("orders-collapse"), this.categoryButtonElement = document.getElementById("category-button"), this.categorySvgElement = document.getElementById("category-svg"), this.sidebarCategoryElement = document.getElementById("sidebar-category"), this.sidebarFinance = document.getElementById("sidebar-finance"), this.sidebarFinanceText = document.getElementById("sidebar-finance-text"), this.sidebarFinanceSvg = document.getElementById("sidebar-finance-svg"), this.sidebarCategoryCollapseElements = document.getElementById("sidebar-category-collapse"), this.buttonAll = document.getElementById("button-all"), this.buttonWeek = document.getElementById("button-week"), this.buttonMonth = document.getElementById("button-month"), this.buttonYear = document.getElementById("button-year"), this.buttonToday = document.getElementById("button-today"), this.buttonInterval = document.getElementById("button-interval"), this.buttonIntervalFrom = document.getElementById("from"), this.buttonIntervalTo = document.getElementById("to"), this.btns = document.querySelectorAll(".button"), this.removeElement(), this.inactive(), this.init()
        }

        async init() {
            const s = this;
            t.getUserInfo() || (location.href = "#/login"), this.buttonAll.onclick = async function () {
                try {
                    const t = await n.request(e + "/operations/?period=all");
                    t && (s.testChart(t), s.activeElement(t))
                } catch (e) {
                    console.log(e)
                }
            }, this.buttonWeek.onclick = async function () {
                try {
                    const t = await n.request(e + "/operations/?period=week");
                    t && (s.testChart(t), s.activeElement(t))
                } catch (e) {
                    console.log(e)
                }
            }, this.buttonMonth.onclick = async function () {
                try {
                    const t = await n.request(e + "/operations/?period=month");
                    t && (s.testChart(t), s.activeElement(t))
                } catch (e) {
                    console.log(e)
                }
            }, this.buttonYear.onclick = async function () {
                try {
                    const t = await n.request(e + "/operations/?period=year");
                    t && (s.testChart(t), s.activeElement(t))
                } catch (e) {
                    console.log(e)
                }
            }, this.buttonToday.onclick = async function () {
                try {
                    const t = await n.request(e + "/operations/?period=today");
                    t && (s.testChart(t), s.activeElement(t))
                } catch (e) {
                    console.log(e)
                }
            }, this.buttonToday.click(), this.buttonInterval.onclick = async function () {
                let t = s.buttonIntervalFrom.value.split("/"), a = s.buttonIntervalTo.value.split("/");
                t = t[2] + "-" + t[0] + "-" + t[1], a = a[2] + "-" + a[0] + "-" + a[1];
                try {
                    const i = await n.request(e + "/operations/?period=interval&dateFrom=" + t + "&dateTo=" + a);
                    i && (s.testChart(i), s.activeElement(i))
                } catch (e) {
                    console.log(e)
                }
            }, $((function () {
                let e = $("#from").datepicker({
                    defaultDate: "+1w",
                    changeMonth: !0,
                    numberOfMonths: 1
                }).on("change", (function () {
                    t.datepicker("option", "minDate", n(this))
                })), t = $("#to").datepicker({
                    defaultDate: "+1w",
                    changeMonth: !0,
                    numberOfMonths: 1
                }).on("change", (function () {
                    e.datepicker("option", "maxDate", n(this))
                }));

                function n(e) {
                    let t;
                    try {
                        t = $.datepicker.parseDate("mm/dd/yy", e.value)
                    } catch (e) {
                        t = null
                    }
                    return t
                }
            }))
        }

        testChart(e) {
            let t = [], n = [];
            e.forEach((e => {
                "expense" === e.type && (t.push(e.amount), n.push(e.category))
            }));
            let s = [], a = [];
            e.forEach((e => {
                "income" === e.type && (s.push(e.amount), a.push(e.category))
            })), Chart.defaults.global.defaultFontFamily = "Roboto-Medium", Chart.defaults.global.defaultFontSize = 12, Chart.defaults.global.defaultFontColor = "#000000";
            let i = this.incomeChart;
            i.width = 414, i.height = 467;
            let o = this.expensesChart;
            o.width = 414, o.height = 467;
            let l = {
                labels: a,
                datasets: [{
                    data: s,
                    backgroundColor: ["#DC3545", "#FD7E14", "#FFC107", "#20C997", "#0D6EFD", "#FFC0CB", "#00FFFF", "#8B008B"]
                }]
            }, r = (new Chart(this.incomeChart, {type: "pie", data: l}), {
                labels: n,
                datasets: [{
                    data: t,
                    backgroundColor: ["#DC3545", "#FD7E14", "#FFC107", "#20C997", "#0D6EFD", "#FFC0CB", "#00FFFF", "#8B008B"]
                }]
            });
            new Chart(this.expensesChart, {type: "pie", data: r})
        }

        removeElement() {
            this.buttonElements.forEach((e => {
                e.classList.remove("active"), e.classList.add("link-dark")
            })), this.svgElements.forEach((e => {
                e.style.setProperty("fill", "black", "important")
            })), this.collapseButtonElements.forEach((e => {
                e.classList.remove("nav-link", "rounded"), e.classList.add("nav-item")
            }))
        }

        activeElement(e) {
            this.sidebarMain.classList.add("nav-link", "active"), this.sidebarMainText.classList.add("nav-link", "active"), this.sidebarMainText.classList.remove("link-dark"), this.ssidebarMainSvg.style.fill = "white";
            for (let e = 0; e < this.btns.length; e++) this.btns[e].addEventListener("click", (function () {
                let e = document.getElementsByClassName("button active");
                e[0].className = e[0].className.replace(" active", ""), this.className += " active"
            }));
            e.forEach((e => {
                let t = document.getElementById(e.id);
                t && t.remove()
            }))
        }

        inactive() {
            this.orderCollapseElement.classList.remove("show"), this.sidebarCategoryCollapseElements.classList.remove("nav-link", "active"), this.sidebarCategoryCollapseElements.classList.add("link-dark"), this.categoryButtonElement.classList.add("link-dark", "collapsed"), this.categoryButtonElement.classList.remove("active"), this.categorySvgElement.style.fill = "black", this.sidebarCategoryElement.style.border = "0px", this.sidebarFinance.classList.remove("nav-link", "active"), this.sidebarFinanceText.classList.remove("active"), this.sidebarFinanceText.classList.add("link-dark"), this.sidebarFinanceSvg.style.fill = "black"
        }
    }

    class l {
        constructor() {
            this.buttonElements = document.querySelectorAll(".button-element"), this.svgElements = document.querySelectorAll(".svg-element"), this.collapseButtonElements = document.querySelectorAll(".collapse-button"), this.sidebarFinance = document.getElementById("sidebar-finance"), this.sidebarFinanceText = document.getElementById("sidebar-finance-text"), this.sidebarFinanceSvg = document.getElementById("sidebar-finance-svg"), this.orderCollapseElement = document.getElementById("orders-collapse"), this.categoryButtonElement = document.getElementById("category-button"), this.categorySvgElement = document.getElementById("category-svg"), this.sidebarCategoryElement = document.getElementById("sidebar-category"), this.sidebarMain = document.getElementById("sidebar-main"), this.sidebarMainText = document.getElementById("sidebar-main-text"), this.ssidebarMainSvg = document.getElementById("sidebar-main-svg"), this.sidebarCategoryCollapseElements = document.getElementById("sidebar-category-collapse"), this.popupExpAndInc = document.getElementById("popup-expense-and-income"), this.popupDeleteOperation = document.getElementById("popup-delete-operation"), this.buttonAll = document.getElementById("button-all"), this.buttonWeek = document.getElementById("button-week"), this.buttonMonth = document.getElementById("button-month"), this.buttonYear = document.getElementById("button-year"), this.buttonToday = document.getElementById("button-today"), this.buttonInterval = document.getElementById("button-interval"), this.buttonIntervalFrom = document.getElementById("from"), this.buttonIntervalTo = document.getElementById("to"), this.btns = document.querySelectorAll(".button"), this.tableBody = document.getElementById("table-body"), this.removeElement(), this.inactive(), this.activeElement(), this.init()
        }

        async init() {
            const s = this;
            t.getUserInfo() || (location.href = "#/login"), this.buttonAll.onclick = async function () {
                try {
                    const t = await n.request(e + "/operations/?period=all");
                    t && s.showTableElements(t)
                } catch (e) {
                    console.log(e)
                }
            }, this.buttonWeek.onclick = async function () {
                try {
                    const t = await n.request(e + "/operations/?period=week");
                    t && s.showTableElements(t)
                } catch (e) {
                    console.log(e)
                }
            }, this.buttonMonth.onclick = async function () {
                try {
                    const t = await n.request(e + "/operations/?period=month");
                    t && s.showTableElements(t)
                } catch (e) {
                    console.log(e)
                }
            }, this.buttonYear.onclick = async function () {
                try {
                    const t = await n.request(e + "/operations/?period=year");
                    t && s.showTableElements(t)
                } catch (e) {
                    console.log(e)
                }
            }, this.buttonToday.onclick = async function () {
                try {
                    const t = await n.request(e + "/operations/?period=today");
                    t && s.showTableElements(t)
                } catch (e) {
                    console.log(e)
                }
            }, this.buttonToday.click(), this.buttonInterval.onclick = async function () {
                let t = s.buttonIntervalFrom.value.split("/"), a = s.buttonIntervalTo.value.split("/");
                t = t[2] + "-" + t[0] + "-" + t[1], a = a[2] + "-" + a[0] + "-" + a[1];
                try {
                    const i = await n.request(e + "/operations/?period=interval&dateFrom=" + t + "&dateTo=" + a);
                    i && s.showTableElements(i)
                } catch (e) {
                    console.log(e)
                }
            }, $((function () {
                let e = $("#from").datepicker({
                    defaultDate: "+1w",
                    changeMonth: !0,
                    numberOfMonths: 1
                }).on("change", (function () {
                    t.datepicker("option", "minDate", n(this))
                })), t = $("#to").datepicker({
                    defaultDate: "+1w",
                    changeMonth: !0,
                    numberOfMonths: 1
                }).on("change", (function () {
                    e.datepicker("option", "maxDate", n(this))
                }));

                function n(e) {
                    let t;
                    try {
                        t = $.datepicker.parseDate("mm/dd/yy", e.value)
                    } catch (e) {
                        t = null
                    }
                    return t
                }
            }))
        }

        removeElement() {
            this.buttonElements.forEach((e => {
                e.classList.remove("active"), e.classList.add("link-dark")
            })), this.svgElements.forEach((e => {
                e.style.setProperty("fill", "black", "important")
            })), this.collapseButtonElements.forEach((e => {
                e.classList.remove("nav-link", "rounded"), e.classList.add("nav-item")
            }))
        }

        activeElement() {
            this.sidebarFinance.classList.add("nav-link", "active"), this.sidebarFinanceText.classList.add("nav-link", "active"), this.sidebarFinanceText.classList.remove("link-dark"), this.sidebarFinanceSvg.style.fill = "white";
            for (let e = 0; e < this.btns.length; e++) this.btns[e].addEventListener("click", (function () {
                let e = document.getElementsByClassName("button active");
                e[0].className = e[0].className.replace(" active", ""), this.className += " active"
            }))
        }

        inactive() {
            this.orderCollapseElement.classList.remove("show"), this.sidebarCategoryCollapseElements.classList.remove("nav-link", "active"), this.sidebarCategoryCollapseElements.classList.add("link-dark"), this.categoryButtonElement.classList.add("link-dark", "collapsed"), this.categoryButtonElement.classList.remove("active"), this.categorySvgElement.style.fill = "black", this.sidebarCategoryElement.style.border = "0px", this.sidebarMain.classList.remove("nav-link", "active"), this.sidebarMainText.classList.remove("active"), this.sidebarMainText.classList.add("link-dark"), this.ssidebarMainSvg.style.fill = "black"
        }

        showTableElements(t) {
            const s = this;
            let a = 1;
            t.forEach((t => {
                for (let e = 0; e < this.btns.length; e++) this.btns[e].addEventListener("click", (function () {
                    let e = document.getElementById(t.id);
                    e && e.remove()
                }));
                const i = document.createElement("tr");
                i.setAttribute("id", t.id), i.className = "tr-item";
                const o = document.createElement("th");
                o.setAttribute("scope", "row"), o.innerText = a.toString();
                const l = document.createElement("td");
                l.className = "row-name-green", "income" === t.type || "доход" === t.type ? (t.type = "доход", l.className = "row-name-green") : "expense" !== t.type && "расход" !== t.type || (t.type = "расход", l.className = "row-name-red"), l.innerText = t.type;
                const r = document.createElement("td");
                r.innerText = t.category;
                const c = document.createElement("td");
                c.innerText = t.amount + "$";
                let m = t.date.split("-"), d = m[2] + "." + m[1] + "." + m[0];
                const h = document.createElement("td");
                h.innerText = d;
                const p = document.createElement("td");
                p.innerText = t.comment;
                const u = document.createElement("td"), g = document.createElement("button");
                g.className = "btn-svg delete-btn", g.innerHTML = '<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2"><path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z" fill="black"/><path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z" fill="black"/><path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z" fill="black"/></svg>';
                const y = document.createElement("a");
                y.setAttribute("href", "#/editIncomeOrExpenses"), y.className = "edit-operation";
                const E = document.createElement("img");
                E.src = "images/iconPen.png", i.appendChild(o), i.appendChild(l), i.appendChild(r), i.appendChild(c), i.appendChild(h), i.appendChild(p), y.appendChild(E), u.appendChild(g), u.appendChild(y), i.appendChild(u), this.tableBody.appendChild(i), this.editOperationElements = document.querySelectorAll(".edit-operation"), this.editOperationElements.forEach((e => {
                    e.onclick = function () {
                        const t = e.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent,
                            n = e.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent,
                            s = e.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent,
                            a = e.parentElement.previousElementSibling.previousElementSibling.textContent,
                            i = e.parentElement.previousElementSibling.textContent,
                            o = e.parentElement.parentElement.id;
                        localStorage.setItem("Type", JSON.stringify(t)), localStorage.setItem("Category", JSON.stringify(n)), localStorage.setItem("Amount", JSON.stringify(s)), localStorage.setItem("Date", JSON.stringify(a)), localStorage.setItem("Comment", JSON.stringify(i)), localStorage.setItem("OperationId", JSON.stringify(o))
                    }
                })), this.deleteBtnElement = document.querySelectorAll(".delete-btn"), this.deleteBtnElement.forEach((t => {
                    t.onclick = function () {
                        s.popupExpAndInc.style.display = "grid", s.popupDeleteOperation.onclick = function () {
                            let s = t.parentElement.parentElement.id;
                            try {
                                n.request(e + "/operations/" + s, "DELETE") && (location.href = "#/expensesAndIncome")
                            } catch (e) {
                                console.log(e)
                            }
                        }
                    }
                })), a += 1
            }))
        }
    }

    class r {
        constructor() {
            this.inputNameElement = document.getElementById("input-name-income"), this.btnSaveElement = document.getElementById("btn-save-income"), this.addInputNameIncome(), this.newNameIncome()
        }

        addInputNameIncome() {
            let e = localStorage.getItem("BlockName");
            JSON.parse(e), this.result = e.replace(/[^а-яё]/gi, " "), this.inputNameElement.placeholder = this.result
        }

        newNameIncome() {
            const s = this;
            let a = localStorage.getItem("BlockId");
            JSON.parse(a), a = a.replace(/[^1-9]/gi, " "), a = parseInt(a), this.btnSaveElement.onclick = function () {
                t.getUserInfo() || (location.href = "#/login");
                try {
                    n.request(e + "/categories/income/" + a, "PUT", {title: s.inputNameElement.value})
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    class c {
        constructor() {
            this.inputNameElement = document.getElementById("input-name-expenses"), this.btnSaveElement = document.getElementById("btn-save-expense"), this.addInputNameExpenses(), this.newNameExpense()
        }

        addInputNameExpenses() {
            let e = localStorage.getItem("BlockName");
            e = e.replace(/[^а-яё]/gi, " "), this.inputNameElement.placeholder = e
        }

        newNameExpense() {
            const s = this;
            let a = localStorage.getItem("BlockId");
            JSON.parse(a), a = a.replace(/[^1-9]/gi, " "), a = parseInt(a), this.btnSaveElement.onclick = function () {
                t.getUserInfo() || (location.href = "#/login");
                try {
                    n.request(e + "/categories/expense/" + a, "PUT", {title: s.inputNameElement.value})
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    class m {
        constructor() {
            this.inputNameCreateIncome = document.getElementById("input-name-create-income"), this.createCategoryIncomeBtn = document.getElementById("create-category-income-btn"), this.createCategoryIncome()
        }

        createCategoryIncome() {
            const t = this;
            this.createCategoryIncomeBtn.onclick = function () {
                let s = t.inputNameCreateIncome.value;
                try {
                    n.request(e + "/categories/income", "POST", {title: s})
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    class d {
        constructor() {
            this.inputNameCreateExpense = document.getElementById("input-name-create-expense"), this.createCategoryExpenseBtn = document.getElementById("create-category-expense-btn"), this.createCategoryIncome()
        }

        createCategoryIncome() {
            const t = this;
            this.createCategoryExpenseBtn.onclick = function () {
                let s = t.inputNameCreateExpense.value;
                try {
                    n.request(e + "/categories/expense", "POST", {title: s})
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    class h {
        constructor() {
            this.createTypeOperation = document.getElementById("create-type-operation"), this.createCategoryOperation = document.getElementById("create-category-operation"), this.createAmountOperation = document.getElementById("create-amount-operation"), this.createDateOperation = document.getElementById("create-date-operation"), this.createCommentOperation = document.getElementById("create-comment-operation"), this.createOperationSaveBtn = document.getElementById("create-operation-save-btn"), this.category = null, this.Categories()
        }

        async Categories() {
            t.getUserInfo() || (location.href = "#/login");
            let s = localStorage.getItem("Type");
            s = s.replace(/[^а-яёa-z]/gi, " "), s = s.replace(/\s+/g, " ").trim();
            let a = localStorage.getItem("Category");
            a = a.replace(/[^а-яёa-z1-9]/gi, " "), a = a.replace(/\s+/g, " ").trim();
            try {
                const t = await n.request(e + "/categories/income");
                this.addInputNameOperations(t), this.editOperation(t), t.forEach((e => {
                    const t = document.createElement("option");
                    t.setAttribute("value", e.title), t.setAttribute("id", e.id), t.className = "option-element", t.innerText = e.title;
                    let n = this.createTypeOperation.selectedIndex,
                        s = this.createTypeOperation.querySelectorAll("option")[n].getAttribute("id");
                    t.style.display = "one" === s ? "block" : "none", this.createCategoryOperation.appendChild(t), this.createTypeOperation.addEventListener("change", (e => {
                        "expense" === this.createTypeOperation.value ? (t.style.display = "none", this.createCategoryOperation.value = " ") : t.style.display = "block"
                    }))
                })), "доход" === s && t.forEach((e => {
                    if (e.title === a) return this.createCategoryOperation.value = a, this.category = e.id, this.category
                })), this.createCategoryOperation.addEventListener("change", (e => {
                    t.forEach((e => {
                        if (e.title && this.createCategoryOperation.value === e.title) return this.category = e.id, this.category
                    }))
                }));
                const i = await n.request(e + "/categories/expense");
                "доход" === s && i.forEach((e => {
                    e.title === a && (this.createCategoryOperation.value = e.title)
                })), this.addInputNameOperations(i), this.editOperation(i), i.forEach((e => {
                    const t = document.createElement("option");
                    t.setAttribute("value", e.title), t.setAttribute("id", e.id), t.className = "option-element-exp", t.innerText = e.title;
                    let n = this.createTypeOperation.selectedIndex,
                        s = this.createTypeOperation.querySelectorAll("option")[n].getAttribute("id");
                    t.style.display = "two" === s ? "block" : "none", this.createCategoryOperation.appendChild(t), this.createTypeOperation.addEventListener("change", (e => {
                        "income" === this.createTypeOperation.value ? (t.style.display = "none", this.createCategoryOperation.value = " ") : t.style.display = "block"
                    }))
                })), "расход" === s && i.forEach((e => {
                    if (e.title === a) return this.createCategoryOperation.value = a, this.category = e.id, this.category
                })), this.createCategoryOperation.addEventListener("change", (e => {
                    i.forEach((e => {
                        if (e.title && this.createCategoryOperation.value === e.title) return this.category = e.id, this.category
                    }))
                }))
            } catch (e) {
                console.log(e)
            }
        }

        addInputNameOperations() {
            let e = localStorage.getItem("Type"), t = localStorage.getItem("Amount"), n = localStorage.getItem("Date"),
                s = localStorage.getItem("Comment");
            e = e.replace(/[^а-яёa-z]/gi, " "), e = e.replace(/\s+/g, " ").trim(), t = t.replace(/[^0-9]/gi, " "), t = t.replace(/\s+/g, " ").trim(), n = n.replace(/[^0-9.]/gi, " "), n = n.replace(/\s+/g, " ").trim(), s = s.replace(/[^а-яёa-z1-9]/gi, " "), s = s.replace(/\s+/g, " ").trim(), n = n.split("."), n = n[2] + "-" + n[1] + "-" + n[0], this.createTypeOperation.value = "доход" === e ? "income" : "expense", this.createAmountOperation.value = t, this.createDateOperation.value = n, this.createCommentOperation.value = s
        }

        editOperation() {
            const s = this;
            let a = localStorage.getItem("OperationId");
            JSON.parse(a), a = a.replace(/[^1-9]/gi, " "), a = parseInt(a), this.createOperationSaveBtn.onclick = function () {
                t.getUserInfo() || (location.href = "#/login");
                try {
                    n.request(e + "/operations/" + a, "PUT", {
                        type: s.createTypeOperation.value,
                        category_id: s.category,
                        amount: s.createAmountOperation.value,
                        date: s.createDateOperation.value,
                        comment: s.createCommentOperation.value
                    }) && (location.href = "#/expensesAndIncome")
                } catch (e) {
                    console.log(e)
                }
                s.removeLocalStorage()
            }
        }

        removeLocalStorage() {
            localStorage.removeItem("Type"), localStorage.removeItem("Amount"), localStorage.removeItem("Date"), localStorage.removeItem("Comment"), localStorage.removeItem("Category"), localStorage.removeItem("OperationId")
        }
    }

    class p {
        constructor() {
            this.newCreateTypeOperation = document.getElementById("new-create-type-operation"), this.newCreateCategoryOperation = document.getElementById("new-create-category-operation"), this.newCreateAmountOperation = document.getElementById("new-create-amount-operation"), this.newCreateDateOperation = document.getElementById("new-create-date-operation"), this.newCreateCommentOperation = document.getElementById("new-create-comment-operation"), this.saveNewCreateOperation = document.getElementById("save-new-create-operation"), this.category = null, this.Categories()
        }

        async Categories() {
            t.getUserInfo() || (location.href = "#/login");
            try {
                const t = await n.request(e + "/categories/income");
                t && this.createNewOperation(t), t.forEach((e => {
                    const n = document.createElement("option");
                    n.setAttribute("value", e.title), n.setAttribute("id", e.id), n.className = "option-element", n.innerText = e.title;
                    let s = this.newCreateTypeOperation.selectedIndex,
                        a = this.newCreateTypeOperation.querySelectorAll("option")[s].getAttribute("id");
                    n.style.display = "one" === a ? "block" : "none", this.newCreateCategoryOperation.appendChild(n), this.newCreateTypeOperation.addEventListener("change", (e => {
                        "expense" === this.newCreateTypeOperation.value ? (n.style.display = "none", this.newCreateCategoryOperation.value = " ") : n.style.display = "block"
                    })), this.newCreateCategoryOperation.addEventListener("change", (e => {
                        t.forEach((e => {
                            if (e.title && this.newCreateCategoryOperation.value === e.title) return this.category = e.id, this.category
                        }))
                    }))
                }));
                const s = await n.request(e + "/categories/expense");
                this.createNewOperation(s), s.forEach((e => {
                    const t = document.createElement("option");
                    t.setAttribute("value", e.title), t.setAttribute("id", e.id), t.className = "option-element-exp", t.innerText = e.title;
                    let n = this.newCreateTypeOperation.selectedIndex,
                        a = this.newCreateTypeOperation.querySelectorAll("option")[n].getAttribute("id");
                    t.style.display = "two" === a ? "block" : "none", this.newCreateCategoryOperation.appendChild(t), this.newCreateTypeOperation.addEventListener("change", (e => {
                        "income" === this.newCreateTypeOperation.value ? (t.style.display = "none", this.newCreateCategoryOperation.value = " ") : t.style.display = "block"
                    })), this.newCreateCategoryOperation.addEventListener("change", (e => {
                        s.forEach((e => {
                            if (e.title && this.newCreateCategoryOperation.value === e.title) return this.category = e.id, this.category
                        }))
                    }))
                }))
            } catch (e) {
                console.log(e)
            }
        }

        createNewOperation() {
            const s = this;
            this.saveNewCreateOperation.onclick = function () {
                t.getUserInfo() || (location.href = "#/login");
                try {
                    n.request(e + "/operations", "POST", {
                        type: s.newCreateTypeOperation.value,
                        category_id: s.category,
                        amount: s.newCreateAmountOperation.value,
                        date: s.newCreateDateOperation.value,
                        comment: s.newCreateCommentOperation.value
                    }) && (location.href = "#/IncomeAndExpense")
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    class u {
        constructor() {
            this.contentElement = document.getElementById("content"), this.stylesElement = document.getElementById("styles"), this.pageTitleElement = document.getElementById("title"), this.profileFullNameElement = document.getElementById("profile-full-name"), this.routes = [{
                route: "#/",
                title: "Главная",
                template: "templates/main.html",
                styles: "styles/index.css",
                load: () => {
                    new o
                }
            }, {
                route: "#/login",
                title: "Войти",
                template: "templates/login.html",
                styles: "styles/login.css",
                load: () => {
                    new s("login")
                }
            }, {
                route: "#/signup",
                title: "Регистрация",
                template: "templates/signup.html",
                styles: "styles/login.css",
                load: () => {
                    new s("signup")
                }
            }, {
                route: "#/expensesAndIncome",
                title: "Главная",
                template: "templates/expensesAndIncome.html",
                styles: "styles/index.css",
                load: () => {
                    new l
                }
            }, {
                route: "#/income",
                title: "Главная",
                template: "templates/income.html",
                styles: "styles/index.css",
                load: () => {
                    new a
                }
            }, {
                route: "#/expenses",
                title: "Главная",
                template: "templates/expenses.html",
                styles: "styles/index.css",
                load: () => {
                    new i
                }
            }, {
                route: "#/editIncomeOrExpenses",
                title: "Главная",
                template: "templates/editIncomeOrExpenses.html",
                styles: "styles/index.css",
                load: () => {
                    new h
                }
            }, {
                route: "#/createIncomeOrExpenses",
                title: "Главная",
                template: "templates/createIncomeOrExpenses.html",
                styles: "styles/index.css",
                load: () => {
                    new p
                }
            }, {
                route: "#/editCategoryIncome",
                title: "Главная",
                template: "templates/editCategoryIncome.html",
                styles: "styles/index.css",
                load: () => {
                    new r
                }
            }, {
                route: "#/createCategoryIncome",
                title: "Главная",
                template: "templates/createCategoryIncome.html",
                styles: "styles/index.css",
                load: () => {
                    new m
                }
            }, {
                route: "#/editCategoryExpenses",
                title: "Главная",
                template: "templates/editCategoryExpenses.html",
                styles: "styles/index.css",
                load: () => {
                    new c
                }
            }, {
                route: "#/createCategoryExpenses",
                title: "Главная",
                template: "templates/createCategoryExpenses.html",
                styles: "styles/index.css",
                load: () => {
                    new d
                }
            }]
        }

        async openRoute() {
            const e = window.location.hash.split("?")[0];
            if ("#/logout" === e) return t.removeTokens(), localStorage.removeItem(t.userInfoKey), localStorage.removeItem("email"), void (window.location.href = "#/login");
            const n = this.routes.find((t => t.route === e));
            if (!n) return void (window.location.href = "#/login");
            this.contentElement.innerHTML = await fetch(n.template).then((e => e.text())), this.stylesElement.setAttribute("href", n.styles), this.pageTitleElement.innerText = n.title;
            const s = t.getUserInfo(), a = localStorage.getItem(t.accessTokenKey);
            s && a && (this.profileFullNameElement.innerText = s.fullName), n.load()
        }
    }

    new class {
        constructor() {
            this.router = new u, window.addEventListener("DOMContentLoaded", this.handleRouteChanging.bind(this)), window.addEventListener("popstate", this.handleRouteChanging.bind(this))
        }

        handleRouteChanging() {
            this.router.openRoute()
        }
    }
})();