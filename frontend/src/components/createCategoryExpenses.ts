import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {CreateCategoryIncome} from "./createCategoryIncome";

export class CreateCategoryExpenses {
    readonly inputNameCreateExpense: HTMLInputElement | null;
    readonly createCategoryExpenseBtn: HTMLElement | null;
    constructor() {
        this.inputNameCreateExpense = document.getElementById('input-name-create-expense')as HTMLInputElement;
        this.createCategoryExpenseBtn = document.getElementById('create-category-expense-btn');

        this.createCategoryIncome();
    }

    createCategoryIncome() {
        const that: CreateCategoryExpenses = this;
        if (this.createCategoryExpenseBtn) {
            this.createCategoryExpenseBtn.onclick = function () {
                let categoryName = that.inputNameCreateExpense?.value;
                try {
                    const result = CustomHttp.request(config.host + '/categories/expense', "POST", {
                        title: categoryName
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
}