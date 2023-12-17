import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {CreateCategoryIncome} from "./createCategoryIncome";
import {PostOperationType} from "../types/post-operation.type";
import {DefaultResponseType} from "../types/default-response.type";

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
                let categoryName: string | undefined = that.inputNameCreateExpense?.value;
                try {
                    const result: Promise<PostOperationType|DefaultResponseType> = CustomHttp.request(config.host + '/categories/expense', "POST", {
                        title: categoryName
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
}