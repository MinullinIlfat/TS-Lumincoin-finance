import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class CreateCategoryIncome {
    readonly inputNameCreateIncome: HTMLInputElement | null;
    readonly createCategoryIncomeBtn: HTMLElement | null;
    constructor() {
        this.inputNameCreateIncome = document.getElementById('input-name-create-income') as HTMLInputElement;
        this.createCategoryIncomeBtn = document.getElementById('create-category-income-btn');

        this.createCategoryIncome();
    }

    createCategoryIncome() {
        const that:CreateCategoryIncome = this
        if (this.createCategoryIncomeBtn) {
            this.createCategoryIncomeBtn.onclick = function () {
                let categoryName: string | undefined = that.inputNameCreateIncome?.value;
                try {
                    const result = CustomHttp.request(config.host + '/categories/income', "POST", {
                        title: categoryName
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
}