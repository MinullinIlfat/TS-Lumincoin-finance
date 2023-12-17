import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {PutCategoryType} from "../types/put-category.type";
import {DefaultResponseType} from "../types/default-response.type";
import {UserInfoType} from "../types/user-info.type";

export class EditCategoryExpenses {
    readonly inputNameElement: HTMLInputElement | null;
    readonly btnSaveElement: HTMLElement | null;

    constructor() {
        this.inputNameElement = document.getElementById('input-name-expenses') as HTMLInputElement;
        this.btnSaveElement = document.getElementById('btn-save-expense');

        this.addInputNameExpenses();
        this.newNameExpense();
    }

    addInputNameExpenses() {
        let result: string | null = localStorage.getItem('BlockName');
        if (result && this.inputNameElement) {
            result = result.replace(/[^а-яё]/gi, ' ');
            this.inputNameElement.placeholder = result;
        }

    }

    newNameExpense() {
        const that: EditCategoryExpenses = this;
        let resultId: string | null = localStorage.getItem('BlockId');
        if (resultId) {
            JSON.parse(resultId);
            resultId = resultId.replace(/[^1-9]/gi, ' ');
            resultId = parseInt(resultId).toString();
        }

        if (this.btnSaveElement) {
            this.btnSaveElement.onclick = function () {
                const userInfo: UserInfoType | null = Auth.getUserInfo();
                if (!userInfo) {
                    location.href = '#/login';
                }

                try {
                    const result: Promise<PutCategoryType | DefaultResponseType> = CustomHttp.request(config.host + '/categories/expense/' + resultId, "PUT", {
                        title: that.inputNameElement?.value
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
}