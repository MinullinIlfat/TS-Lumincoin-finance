import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UserInfoType} from "../types/user-info.type";
import {GetCategoryType} from "../types/get-category.type";
import {DefaultResponseType} from "../types/default-response.type";
import {PostOperationType} from "../types/post-operation.type";

export class EditIncomeOrExpenses {
    readonly createTypeOperation: HTMLInputElement | null;
    readonly createCategoryOperation: HTMLInputElement | null;
    readonly createAmountOperation: HTMLInputElement | null;
    readonly createDateOperation: HTMLElement | null;
    readonly createCommentOperation: HTMLInputElement | null;
    readonly createOperationSaveBtn: HTMLElement | null;
    private category: number | null;
    constructor() {
        this.createTypeOperation = document.getElementById('create-type-operation') as HTMLInputElement;
        this.createCategoryOperation = document.getElementById('create-category-operation') as HTMLInputElement;
        this.createAmountOperation = document.getElementById('create-amount-operation') as HTMLInputElement;
        this.createDateOperation = document.getElementById('create-date-operation');
        this.createCommentOperation = document.getElementById('create-comment-operation') as HTMLInputElement;
        this.createOperationSaveBtn = document.getElementById('create-operation-save-btn');

        this.category = null;

        this.Categories()
    }

    private async Categories():Promise<void> {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/login'
        }

        let type: string | null = localStorage.getItem('Type')
        if (type) {
            type = type.replace(/[^а-яёa-z]/gi, ' ');
            type = type.replace(/\s+/g, ' ').trim();
        }

        let category: string | null = localStorage.getItem('Category')
        if (category) {
            category = category.replace(/[^а-яёa-z1-9]/gi, ' ');
            category = category.replace(/\s+/g, ' ').trim();
        }

        try {
            const result: GetCategoryType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/income');
            if (result) {
                (result as GetCategoryType[]).forEach((item: GetCategoryType) => {
                    const option:HTMLElement | null = document.createElement('option')
                    option.setAttribute('value', item.title);
                    option.setAttribute('id', item.id.toString());
                    option.className = 'option-element';
                    option.innerText = item.title

                    if (this.createTypeOperation) {
                        let indexSelected = this.createTypeOperation.selectedIndex,
                            options = this.createTypeOperation.querySelectorAll('option')[indexSelected];

                        let selectedId = options.getAttribute('id');
                        if (selectedId === 'one') {
                            option.style.display = 'block'
                        } else {
                            option.style.display = 'none'
                        }

                        if (this.createCategoryOperation) {
                            this.createCategoryOperation.appendChild(option)
                        }

                        this.createTypeOperation.addEventListener('change', (e) => {
                            if (this.createTypeOperation && this.createCategoryOperation
                                && (this.createTypeOperation as HTMLInputElement).value === 'expense') {
                                option.style.display = 'none'
                                (this.createCategoryOperation as HTMLInputElement).value = ' '
                            } else {
                                option.style.display = 'block'
                            }
                        })
                    }
                })

                if (type === 'доход') {
                    (result as GetCategoryType[]).forEach((item:GetCategoryType) => {
                        if (item.title === category && this.createCategoryOperation) {
                            this.createCategoryOperation.value = category
                            this.category = item.id
                            return this.category
                        }
                    })
                }
                if (this.createCategoryOperation) {
                    this.createCategoryOperation.addEventListener('change', (e) => {
                        (result as GetCategoryType[]).forEach((item:GetCategoryType) => {
                            if (item.title && (this.createCategoryOperation as HTMLInputElement).value === item.title) {
                                this.category = item.id
                                return this.category
                            }
                        })
                    })
                }
            }

            const resultExpense: GetCategoryType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/expense');
            if (type === 'доход') {
                (resultExpense as GetCategoryType[]).forEach((item:GetCategoryType) => {
                    if (item.title === category && this.createCategoryOperation) {
                        (this.createCategoryOperation as HTMLInputElement).value = item.title
                    }
                })
            }
            (resultExpense as GetCategoryType[]).forEach((itemExp:GetCategoryType) => {
                const optionExp: HTMLElement | null = document.createElement('option')
                optionExp.setAttribute('value', itemExp.title);
                optionExp.setAttribute('id', itemExp.id.toString());
                optionExp.className = 'option-element-exp';
                optionExp.innerText = itemExp.title

                if (this.createTypeOperation) {
                    let indexSelected: number = this.createTypeOperation.selectedIndex,
                        option = this.createTypeOperation.querySelectorAll('option')[indexSelected];
                    let selectedId: string | null = option.getAttribute('id');

                    if (selectedId === 'two') {
                        optionExp.style.display = 'block'
                    } else {
                        optionExp.style.display = 'none'
                    }

                    if (this.createCategoryOperation) {
                        this.createCategoryOperation.appendChild(optionExp)
                    }
                    this.createTypeOperation.addEventListener('change', (e) => {

                        if (this.createTypeOperation && this.createCategoryOperation && this.createTypeOperation.value === 'income') {
                            optionExp.style.display = 'none'
                            this.createCategoryOperation.value = ' '
                        } else {
                            optionExp.style.display = 'block'
                        }
                    })
                }
            })

            if (type === 'расход') {
                (resultExpense as GetCategoryType[]).forEach((item: GetCategoryType) => {
                    if (item.title === category && this.createCategoryOperation) {
                        this.createCategoryOperation.value = category
                        this.category = item.id
                        return this.category
                    }
                })
            }
            if (this.createCategoryOperation) {
                this.createCategoryOperation.addEventListener('change', (e) => {
                    (resultExpense as GetCategoryType[]).forEach((item: GetCategoryType) => {
                        if (item.title && this.createCategoryOperation && (this.createCategoryOperation as HTMLInputElement).value === item.title) {
                            this.category = item.id
                            return this.category
                        }
                    })
                })
            }

        } catch (error) {
            console.log(error);
        }
        this.addInputNameOperations()
        this.editOperation()
    }

    private addInputNameOperations(): void {
        let type: string | null = localStorage.getItem('Type')
        let amount: string | null = localStorage.getItem('Amount')
        let date: string | null = localStorage.getItem('Date')
        let comment: string | null = localStorage.getItem('Comment')
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
        }

        if (comment) {
            comment = comment.replace(/[^а-яёa-z1-9]/gi, ' ');
            comment = comment.replace(/\s+/g, ' ').trim();
        }

        date = date.split('.')
        date = date[2] + '-' + date [1] + '-' + date[0]

        if (type === 'доход' && this.createTypeOperation) {
            (this.createTypeOperation as HTMLInputElement).value = 'income'
        } else {
            (this.createTypeOperation as HTMLInputElement).value = 'expense'
        }
        if (this.createAmountOperation) {
            (this.createAmountOperation as HTMLInputElement).value = amount as string
        }
        if (this.createDateOperation) {
            (this.createDateOperation as HTMLInputElement).value = date

        }
        if (this.createCommentOperation) {
            (this.createCommentOperation as HTMLInputElement).value = comment as string
        }

    }

    private editOperation():void {
        const that: EditIncomeOrExpenses = this
        let operationId: string | null = localStorage.getItem('OperationId')
        if (operationId) {
            JSON.parse(operationId)
            operationId = operationId.replace(/[^1-9]/gi, ' ');
            operationId = parseInt(operationId).toString()
        }
        if (this.createOperationSaveBtn) {
            this.createOperationSaveBtn.onclick = function () {
                const userInfo: UserInfoType | null = Auth.getUserInfo();
                if (!userInfo) {
                    location.href = '#/login'
                }
                if (that.createTypeOperation && that.createAmountOperation
                    && that.createDateOperation && that.createCommentOperation) {
                    try {
                        const result: Promise<PostOperationType | DefaultResponseType> = CustomHttp.request(config.host + '/operations/' + operationId, "PUT", {
                            type: (that.createTypeOperation as HTMLInputElement).value,
                            category_id: that.category,
                            amount: (that.createAmountOperation as HTMLInputElement).value,
                            date: (that.createDateOperation as HTMLInputElement).value,
                            comment: (that.createCommentOperation as HTMLInputElement).value
                        });
                        if (result) {
                            location.href = '#/expensesAndIncome'
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                that.removeLocalStorage()
            }
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