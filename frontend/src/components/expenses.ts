import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UserInfoType} from "../types/user-info.type";
import {GetCategoryType} from "../types/get-category.type";
import {DefaultResponseType} from "../types/default-response.type";
import {DeleteCategoryType} from "../types/delete-category.type";

export class Expenses {
    readonly expensesElement: HTMLElement | null;
    readonly incomeElement: HTMLElement | null;
    readonly expensesTextElement: HTMLElement | null;
    readonly incomeTextElement: HTMLElement | null;
    readonly categoryButtonElement: HTMLElement | null;
    readonly sidebarCategoryElement: HTMLElement | null;
    readonly orderCollapseElement: HTMLElement | null;
    readonly categorySvgElement: HTMLElement | null;
    private buttonElements: NodeListOf<Element>;
    readonly sidebarCategoryCollapseElements: HTMLElement | null;
    private collapseButtonElements: NodeListOf<Element>;
    private svgElements: NodeListOf<Element>;

    readonly sidebarFinance: HTMLElement | null;
    readonly sidebarFinanceText: HTMLElement | null;
    readonly sidebarFinanceSvg: HTMLElement | null;

    readonly sidebarMain: HTMLElement | null;
    readonly sidebarMainText: HTMLElement | null;
    readonly sidebarMainSvg: HTMLElement | null;

    private popupExpenses: HTMLElement | null;

    constructor() {
        this.expensesElement = document.getElementById('expenses')
        this.incomeElement = document.getElementById('income')
        this.expensesTextElement = document.getElementById('expenses-text')
        this.incomeTextElement = document.getElementById('income-text')
        this.categoryButtonElement = document.getElementById('category-button')
        this.sidebarCategoryElement = document.getElementById('sidebar-category')
        this.orderCollapseElement = document.getElementById('orders-collapse')
        this.categorySvgElement = document.getElementById('category-svg')
        this.buttonElements = document.querySelectorAll('.button-element')
        this.sidebarCategoryCollapseElements = document.getElementById('sidebar-category-collapse')
        this.collapseButtonElements = document.querySelectorAll('.collapse-button')
        this.svgElements = document.querySelectorAll('.svg-element')

        this.sidebarFinance = document.getElementById('sidebar-finance')
        this.sidebarFinanceText = document.getElementById('sidebar-finance-text')
        this.sidebarFinanceSvg = document.getElementById('sidebar-finance-svg')

        this.sidebarMain = document.getElementById('sidebar-main');
        this.sidebarMainText = document.getElementById('sidebar-main-text');
        this.sidebarMainSvg = document.getElementById('sidebar-main-svg');

        this.popupExpenses = document.getElementById('popup-expenses')

        this.removeElement()
        this.inactive()
        this.activeElement()
        this.init()
    }

    private async init(): Promise<void> {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/login'
        }
        try {
            const result: GetCategoryType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/expense');
            if (result as GetCategoryType[]) {
                this.showExpenseElements(result)
            }
        } catch (error) {
            console.log(error);
        }
    }

    private showExpenseElements(result: GetCategoryType[] | DefaultResponseType): void {
        const categoryItems: HTMLElement | null = document.getElementById('category-expense-items');
        if (categoryItems) {
            (result as GetCategoryType[]).forEach((item: any) => {
                const categoryItem: HTMLElement | null = document.createElement('div');
                categoryItem.className = 'category-item';
                categoryItem.setAttribute('id', item.id)

                const categoryItemName: HTMLElement | null = document.createElement('div');
                categoryItemName.className = 'category-item-name';
                categoryItemName.innerText = item.title;

                const categoryItemActive: HTMLElement | null = document.createElement('div');
                categoryItemActive.className = 'category-item-active';

                const editBtnIncome: HTMLElement | null = document.createElement('a');
                editBtnIncome.setAttribute('href', '#/editCategoryExpenses');
                editBtnIncome.className = 'edit-btn-expenses btn btn-primary me-2';
                editBtnIncome.innerText = 'Редактировать';

                const deleteBtn: HTMLElement | null = document.createElement('button');
                deleteBtn.className = 'delete-btn btn btn-danger';
                deleteBtn.innerText = 'Удалить';

                categoryItemActive.appendChild(editBtnIncome)
                categoryItemActive.appendChild(deleteBtn)

                categoryItem.appendChild(categoryItemName)
                categoryItem.appendChild(categoryItemActive)
                categoryItems.appendChild(categoryItem)
            })

            const categoryItemAdd: HTMLElement | null = document.createElement('a');
            categoryItemAdd.className = 'category-item category-item-add d-flex justify-content-center align-items-center';
            categoryItemAdd.setAttribute('href', '#/createCategoryExpenses');
            categoryItemAdd.innerText = '+';

            categoryItems.appendChild(categoryItemAdd)

            const editBtnElements: NodeListOf<Element> = document.querySelectorAll('.edit-btn-expenses')
            editBtnElements.forEach((item: any) => {
                item.onclick = function () {
                    const result: string | null = item.parentElement.previousElementSibling.textContent
                    const resultId: string | null = item.parentElement.parentElement.id
                    localStorage.setItem('BlockName', JSON.stringify(result))
                    localStorage.setItem('BlockId', JSON.stringify(resultId))
                }
            })

            const deleteBtnElement: NodeListOf<Element> = document.querySelectorAll('.delete-btn')
            const popupDeleteCategory: HTMLElement | null = document.getElementById('popup-delete-category-expense')
            const that: Expenses = this
            deleteBtnElement.forEach((item: any) => {
                item.onclick = function () {
                    if (that.popupExpenses) {
                        that.popupExpenses.style.display = 'grid'
                    }
                    if (popupDeleteCategory) {
                        popupDeleteCategory.onclick = function () {
                            let resultId: string | null = item.parentElement.parentElement.id
                            try {
                                const result: DeleteCategoryType | DefaultResponseType  = CustomHttp.request(config.host + '/categories/expense/' + resultId, "DELETE");
                                if (result) {
                                    location.href = '#/expenses'
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                }
            })
        }
    }

    private removeElement(): void {
        this.buttonElements.forEach(item => {
            item.classList.remove('active')
            item.classList.add('link-dark')
        })
        this.svgElements.forEach((item:any) => {
            item.style.setProperty("fill", "black", "important")
        })
        this.collapseButtonElements.forEach(item => {
            item.classList.remove('nav-link')
        })

        localStorage.removeItem('BlockName')
        localStorage.removeItem('BlockId')
    }

    private activeElement(): void {
        if (this.expensesElement) {
            this.expensesElement.classList.remove('link-dark')
            this.expensesElement.classList.add('nav-link', 'active')
            this.expensesElement.style.borderRadius = '0px'
            this.expensesElement.style.borderBottomLeftRadius = '5px'
            this.expensesElement.style.borderBottomRightRadius = '5px'
        }


        if (this.sidebarCategoryCollapseElements) {
            this.sidebarCategoryCollapseElements.classList.add('nav-link', 'active')
            this.sidebarCategoryCollapseElements.style.borderRadius = '0px'
            this.sidebarCategoryCollapseElements.style.borderTopLeftRadius = '5px'
            this.sidebarCategoryCollapseElements.style.borderTopRightRadius = '5px'
        }

        if (this.categoryButtonElement) {
            this.categoryButtonElement.classList.remove('link-dark', 'collapsed')
            this.categoryButtonElement.classList.add('nav-link', 'active')
        }

        if (this.expensesTextElement) {
            this.expensesTextElement.classList.remove('link-dark')
            this.expensesTextElement.classList.add('nav-link', 'active')
        }

        if (this.orderCollapseElement) {
            this.orderCollapseElement.classList.add('show')
        }

        if (this.categorySvgElement) {
            this.categorySvgElement.style.fill = 'white'

        }
        if (this.sidebarCategoryElement) {
            this.sidebarCategoryElement.style.border = '1px solid #0D6EFD'
            this.sidebarCategoryElement.style.borderRadius = '5px'
        }
    }

    private inactive():void {
        if (this.incomeElement) {
            this.incomeElement.style.borderRadius = '0px'
        }
        if (this.incomeTextElement) {
            this.incomeTextElement.classList.remove('link-dark')
        }
        if (this.sidebarFinance) {
            this.sidebarFinance.classList.remove('nav-link', 'active')
        }
        if (this.sidebarFinanceText) {
            this.sidebarFinanceText.classList.remove('active')
            this.sidebarFinanceText.classList.add('link-dark')
        }

        if (this.sidebarFinanceSvg) {
            this.sidebarFinanceSvg.style.fill = 'black'
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