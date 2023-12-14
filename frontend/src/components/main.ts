import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class Main {
    private buttonElements: NodeListOf<Element>;
    private collapseButtonElements: NodeListOf<Element>;
    private svgElements: NodeListOf<Element>;
    readonly incomeChart: HTMLElement | null;
    readonly expensesChart: HTMLElement | null;
    readonly sidebarMain: HTMLElement | null;
    readonly sidebarMainText: HTMLElement | null;
    readonly sidebarMainSvg: HTMLElement | null;
    readonly orderCollapseElement: HTMLElement | null;
    readonly categoryButtonElement: HTMLElement | null;
    readonly categorySvgElement: HTMLElement | null;
    readonly sidebarCategoryElement: HTMLElement | null;
    readonly sidebarFinance: HTMLElement | null;
    readonly sidebarFinanceText: HTMLElement | null;
    readonly sidebarFinanceSvg: HTMLElement | null;
    readonly sidebarCategoryCollapseElements: HTMLElement | null;

    readonly buttonAll: HTMLElement | null;
    readonly buttonWeek: HTMLElement | null;
    readonly buttonMonth: HTMLElement | null;
    readonly buttonYear: HTMLElement | null;
    readonly buttonToday: HTMLElement | null;
    readonly buttonInterval: HTMLElement | null;
    private buttonIntervalFrom: HTMLInputElement | null;
    private buttonIntervalTo: HTMLInputElement | null;

    private btns: NodeListOf<Element>;

    constructor() {
        this.buttonElements = document.querySelectorAll('.button-element')
        this.collapseButtonElements = document.querySelectorAll('.collapse-button')
        this.svgElements = document.querySelectorAll('.svg-element')
        this.incomeChart = document.getElementById("incomeChart");
        this.expensesChart = document.getElementById("expensesChart");
        this.sidebarMain = document.getElementById('sidebar-main');
        this.sidebarMainText = document.getElementById('sidebar-main-text');
        this.sidebarMainSvg = document.getElementById('sidebar-main-svg');
        this.orderCollapseElement = document.getElementById('orders-collapse');
        this.categoryButtonElement = document.getElementById('category-button');
        this.categorySvgElement = document.getElementById('category-svg');
        this.sidebarCategoryElement = document.getElementById('sidebar-category');
        this.sidebarFinance = document.getElementById('sidebar-finance')
        this.sidebarFinanceText = document.getElementById('sidebar-finance-text')
        this.sidebarFinanceSvg = document.getElementById('sidebar-finance-svg')
        this.sidebarCategoryCollapseElements = document.getElementById('sidebar-category-collapse');

        this.buttonAll = document.getElementById('button-all');
        this.buttonWeek = document.getElementById('button-week');
        this.buttonMonth = document.getElementById('button-month');
        this.buttonYear = document.getElementById('button-year');
        this.buttonToday = document.getElementById('button-today');
        this.buttonInterval = document.getElementById('button-interval');
        this.buttonIntervalFrom = document.getElementById('from') as HTMLInputElement;
        this.buttonIntervalTo = document.getElementById('to') as HTMLInputElement;

        this.btns = document.querySelectorAll('.button');

        this.removeElement();
        this.inactive();
        this.init();
    }

    private async init(): Promise<void> {
        const that: Main = this
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/login'
        }
        if (this.buttonAll) {
            this.buttonAll.onclick = async function () {
                try {
                    const result = await CustomHttp.request(config.host + '/operations/?period=all');
                    if (result) {
                        that.testChart(result)
                        that.activeElement(result)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        if (this.buttonWeek) {
            this.buttonWeek.onclick = async function () {
                try {
                    const result = await CustomHttp.request(config.host + '/operations/?period=week');
                    if (result) {
                        that.testChart(result)
                        that.activeElement(result)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        if (this.buttonMonth) {
            this.buttonMonth.onclick = async function () {
                try {
                    const result = await CustomHttp.request(config.host + '/operations/?period=month');
                    if (result) {
                        that.testChart(result)
                        that.activeElement(result)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        if (this.buttonYear) {
            this.buttonYear.onclick = async function () {
                try {
                    const result = await CustomHttp.request(config.host + '/operations/?period=year');
                    if (result) {
                        that.testChart(result)
                        that.activeElement(result)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        if (this.buttonToday) {
            this.buttonToday.onclick = async function () {
                try {
                    const result = await CustomHttp.request(config.host + '/operations/?period=today');
                    if (result) {
                        that.testChart(result)
                        that.activeElement(result)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            this.buttonToday.click()
        }

        if (this.buttonInterval) {
            this.buttonInterval.onclick = async function () {
                if (that.buttonIntervalFrom && that.buttonIntervalTo) {
                    let from: any = that.buttonIntervalFrom.value.split('/')

                    let to: any = that.buttonIntervalTo.value.split('/')
                    from = from[2] + '-' + from[0] + '-' + from[1]
                    to = to[2] + '-' + to[0] + '-' + to[1]

                    try {
                        const result = await CustomHttp.request(config.host + '/operations/?period=interval&dateFrom=' + from + '&dateTo=' + to);
                        if (result) {
                            that.testChart(result)
                            that.activeElement(result)
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }


        $(function (): void {
            let dateFormat: string = "mm/dd/yy",
                from = $("#from")
                    .datepicker({
                        defaultDate: "+1w",
                        changeMonth: true,
                        numberOfMonths: 1
                    })
                    .on("change", function () {
                        to.datepicker("option", "minDate", getDate(that));
                    }),
                to = $("#to").datepicker({
                    defaultDate: "+1w",
                    changeMonth: true,
                    numberOfMonths: 1
                })
                    .on("change", function () {
                        from.datepicker("option", "maxDate", getDate(that));
                    });

            function getDate(element: any) {
                let date;
                try {
                    date = $.datepicker.parseDate(dateFormat, element.value);
                } catch (error) {
                    date = null;
                }

                return date;
            }
        });
    }

    testChart(result:any) {
        let expenseArrAmount:any[] = [];
        let expenseArrCategory:any[] = [];
        result.forEach((item: any) => {
            if (item.type === 'expense') {
                expenseArrAmount.push(item.amount)
                expenseArrCategory.push(item.category)
            }
        })
        let incomeArrAmount:any[] = [];
        let incomeArrCategory:any[] = [];
        result.forEach((item: any) => {
            if (item.type === 'income') {
                incomeArrAmount.push(item.amount)
                incomeArrCategory.push(item.category)
            }
        })


        Chart.defaults.global.defaultFontFamily = "Roboto-Medium";
        Chart.defaults.global.defaultFontSize = 12;
        Chart.defaults.global.defaultFontColor = "#000000";

        let canvasIncome: HTMLElement | null = this.incomeChart;
        if (canvasIncome) {
            (canvasIncome as HTMLInputElement).width = 414;
            (canvasIncome as HTMLInputElement).height = 467;
        }

        let canvasExpenses: HTMLElement | null = this.expensesChart;
        (canvasExpenses as HTMLInputElement).width = 414;
        (canvasExpenses as HTMLInputElement).height = 467;

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
                }]
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
                }]
        };

        let expensesChartView = new Chart(this.expensesChart, {
            type: 'pie',
            data: expensesChartData
        });
    }

    removeElement() {
        this.buttonElements.forEach(item => {
            item.classList.remove('active')
            item.classList.add('link-dark')
        })
        this.svgElements.forEach((item: any) => {
            item.style.setProperty("fill", "black", "important")
        })
        this.collapseButtonElements.forEach(item => {
            item.classList.remove('nav-link', 'rounded')
            item.classList.add('nav-item')
        })
    }

    private activeElement(result:any):void {
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
                current[0].className = current[0].className.replace(" active", "");
                this.className += " active";
            });
        }

        result.forEach((item: any) => {
            let tableItem = document.getElementById(item.id);
            if (tableItem) {
                tableItem.remove()
            }
        })

    }

    private inactive(): void {
        if (this.orderCollapseElement) {
            this.orderCollapseElement.classList.remove('show')
        }
        if (this.sidebarCategoryCollapseElements) {
            this.sidebarCategoryCollapseElements.classList.remove('nav-link', 'active')
            this.sidebarCategoryCollapseElements.classList.add('link-dark')
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
            this.sidebarFinanceSvg.style.fill = 'black'

        }
    }
}


