import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config.ts";

export class CreateIncomeOrExpenses {
    constructor() {
        this.newCreateTypeOperation = document.getElementById('new-create-type-operation');
        this.newCreateCategoryOperation = document.getElementById('new-create-category-operation');
        this.newCreateAmountOperation = document.getElementById('new-create-amount-operation');
        this.newCreateDateOperation = document.getElementById('new-create-date-operation');
        this.newCreateCommentOperation = document.getElementById('new-create-comment-operation');
        this.saveNewCreateOperation = document.getElementById('save-new-create-operation');
        this.category = null;

        this.Categories();
    }

    async Categories() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/login';
        }
        try {
            const result = await CustomHttp.request(config.host + '/categories/income');
            if (result) {
                this.createNewOperation(result);
            }
            result.forEach(item => {
                const option = document.createElement('option');
                option.setAttribute('value', item.title);
                option.setAttribute('id', item.id);
                option.className = 'option-element';
                option.innerText = item.title;

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
                    if (this.newCreateTypeOperation.value === 'expense') {
                        option.style.display = 'none';
                        this.newCreateCategoryOperation.value = ' ';
                    } else {
                        option.style.display = 'block';
                    }
                })
                this.newCreateCategoryOperation.addEventListener('change', (e) => {
                    result.forEach(item => {
                        if (item.title && this.newCreateCategoryOperation.value === item.title) {
                            this.category = item.id;
                            return this.category;
                        }
                    })
                })
            })

            const resultExpense = await CustomHttp.request(config.host + '/categories/expense');
            this.createNewOperation(resultExpense);
            resultExpense.forEach(itemExp => {
                const optionExp = document.createElement('option');
                optionExp.setAttribute('value', itemExp.title);
                optionExp.setAttribute('id', itemExp.id);
                optionExp.className = 'option-element-exp';
                optionExp.innerText = itemExp.title;

                let indexSelected = this.newCreateTypeOperation.selectedIndex,
                    option = this.newCreateTypeOperation.querySelectorAll('option')[indexSelected];

                let selectedId = option.getAttribute('id');

                if (selectedId === 'two') {
                    optionExp.style.display = 'block';
                } else {
                    optionExp.style.display = 'none';
                }

                this.newCreateCategoryOperation.appendChild(optionExp)
                this.newCreateTypeOperation.addEventListener('change', (e) => {
                    if (this.newCreateTypeOperation.value === 'income') {
                        optionExp.style.display = 'none';
                        this.newCreateCategoryOperation.value = ' ';
                    } else {
                        optionExp.style.display = 'block';
                    }
                })

                this.newCreateCategoryOperation.addEventListener('change', (e) => {
                    resultExpense.forEach(item => {
                        if (item.title && this.newCreateCategoryOperation.value === item.title) {
                            this.category = item.id;
                            return this.category;
                        }
                    })
                })
            })
        } catch (error) {
            console.log(error);
        }
    }

    createNewOperation() {
        const that = this;
        this.saveNewCreateOperation.onclick = function () {
            const userInfo = Auth.getUserInfo();
            if (!userInfo) {
                location.href = '#/login';
            }
            try {
                const result = CustomHttp.request(config.host + '/operations', "POST", {
                    type: that.newCreateTypeOperation.value,
                    category_id: that.category,
                    amount: that.newCreateAmountOperation.value,
                    date: that.newCreateDateOperation.value,
                    comment: that.newCreateCommentOperation.value
                });

                if (result) {
                    location.href = '#/IncomeAndExpense';
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}