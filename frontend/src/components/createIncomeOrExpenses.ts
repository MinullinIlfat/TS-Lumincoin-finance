import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UserInfoType} from "../types/user-info.type";
import {GetCategoryType} from "../types/get-category.type";
import {DefaultResponseType} from "../types/default-response.type";
import {PostOperationType} from "../types/post-operation.type";

export class CreateIncomeOrExpenses {
    readonly newCreateTypeOperation: HTMLSelectElement | null;
    readonly newCreateCategoryOperation: HTMLInputElement | null;
    private newCreateAmountOperation: HTMLInputElement | null;
    private newCreateDateOperation: HTMLInputElement | null;
    private newCreateCommentOperation: HTMLInputElement | null;
    readonly saveNewCreateOperation: HTMLElement | null;
    private category: string | null;

    constructor() {
        this.newCreateTypeOperation = document.getElementById('new-create-type-operation') as HTMLSelectElement;
        this.newCreateCategoryOperation = document.getElementById('new-create-category-operation') as HTMLInputElement;
        this.newCreateAmountOperation = document.getElementById('new-create-amount-operation') as HTMLInputElement;
        this.newCreateDateOperation = document.getElementById('new-create-date-operation') as HTMLInputElement;
        this.newCreateCommentOperation = document.getElementById('new-create-comment-operation') as HTMLInputElement;
        this.saveNewCreateOperation = document.getElementById('save-new-create-operation');
        this.category = null;

        this.Categories();
    }

    private async Categories(): Promise<void> {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/login';
        }
        try {
            const result: GetCategoryType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/income');
            if (result as GetCategoryType[]) {
                this.createNewOperation();
            }
            (result as GetCategoryType[]).forEach(item => {
                const option: HTMLElement | null = document.createElement('option');
                option.setAttribute('value', item.title);
                option.setAttribute('id', item.id.toString());
                option.className = 'option-element';
                option.innerText = item.title;

                if (this.newCreateTypeOperation && this.newCreateCategoryOperation) {
                    let indexSelected = this.newCreateTypeOperation.selectedIndex,
                        options = this.newCreateTypeOperation.querySelectorAll('option')[indexSelected];

                    let selectedId = options.getAttribute('id');
                    if (selectedId === 'one') {
                        option.style.display = 'block';
                    } else {
                        option.style.display = 'none';
                    }

                    this.newCreateCategoryOperation.appendChild(option);

                    this.newCreateTypeOperation.addEventListener('change', (e) => {
                        if (this.newCreateTypeOperation && this.newCreateCategoryOperation && this.newCreateTypeOperation.value === 'expense') {
                            option.style.display = 'none';
                            this.newCreateCategoryOperation.value = ' ';
                        } else {
                            option.style.display = 'block';
                        }
                    })
                    this.newCreateCategoryOperation.addEventListener('change', (e) => {
                        (result as GetCategoryType[]).forEach((item: GetCategoryType) => {
                            if (item.title && this.newCreateCategoryOperation && this.newCreateCategoryOperation.value === item.title) {
                                this.category = item.id.toString();
                                // return this.category;
                            }
                        })
                    })
                }

            })

            const resultExpense: GetCategoryType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/expense');
            this.createNewOperation();
            (resultExpense as GetCategoryType[]).forEach((itemExp: GetCategoryType) => {
                const optionExp: HTMLElement | null = document.createElement('option');
                optionExp.setAttribute('value', itemExp.title);
                optionExp.setAttribute('id', itemExp.id.toString());
                optionExp.className = 'option-element-exp';
                optionExp.innerText = itemExp.title;

                if (this.newCreateTypeOperation && this.newCreateCategoryOperation) {
                    let indexSelected = this.newCreateTypeOperation.selectedIndex,
                        option = this.newCreateTypeOperation.querySelectorAll('option')[indexSelected];

                    let selectedId: string | null = option.getAttribute('id');

                    if (selectedId === 'two') {
                        optionExp.style.display = 'block';
                    } else {
                        optionExp.style.display = 'none';
                    }

                    this.newCreateCategoryOperation.appendChild(optionExp)
                    this.newCreateTypeOperation.addEventListener('change', (e) => {
                        if (this.newCreateTypeOperation && this.newCreateCategoryOperation
                            && this.newCreateTypeOperation.value === 'income') {
                            optionExp.style.display = 'none';
                            this.newCreateCategoryOperation.value = ' ';
                        } else {
                            optionExp.style.display = 'block';
                        }
                    })

                    this.newCreateCategoryOperation.addEventListener('change', (e) => {
                        (resultExpense as GetCategoryType[]).forEach(item => {
                            if (item.title && this.newCreateCategoryOperation && this.newCreateCategoryOperation.value === item.title) {
                                this.category = item.id.toString();
                                // return this.category;
                            }
                        })
                    })
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    private createNewOperation(): void {
        const that: CreateIncomeOrExpenses = this;
        if (this.saveNewCreateOperation) {
            this.saveNewCreateOperation.onclick = function () {
                const userInfo: UserInfoType | null = Auth.getUserInfo();
                if (!userInfo) {
                    location.href = '#/login';
                }
                if (that.newCreateTypeOperation && that.newCreateAmountOperation
                    && that.newCreateDateOperation && that.newCreateCommentOperation) {
                    try {
                        const result: Promise<PostOperationType | DefaultResponseType> = CustomHttp.request(config.host + '/operations', "POST", {
                            type: that.newCreateTypeOperation.value,
                            category_id: that.category,
                            amount: that.newCreateAmountOperation.value,
                            date: that.newCreateDateOperation.value,
                            comment: that.newCreateCommentOperation.value
                        });

                        if (result as unknown) {
                            location.href = '#/IncomeAndExpense';
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }
    }
}