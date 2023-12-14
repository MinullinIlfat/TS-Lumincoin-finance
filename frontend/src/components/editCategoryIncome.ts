import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class EditCategoryIncome {
    readonly inputNameElement: HTMLInputElement | null;
    readonly btnSaveElement: HTMLElement | null;
    constructor() {
        this.inputNameElement = document.getElementById('input-name-income')as HTMLInputElement;
        this.btnSaveElement = document.getElementById('btn-save-income');

        this.addInputNameIncome()
        this.newNameIncome()
    }

    addInputNameIncome() {
        let result: string | null = localStorage.getItem('BlockName');
        if (result) {
            JSON.parse(result);
            result = result.replace(/[^а-яё]/gi, ' ');
            if (this.inputNameElement) {
                this.inputNameElement.placeholder = result;
            }
        }
    }

    newNameIncome() {
        const that: EditCategoryIncome = this;
        let resultId: number | string | null = localStorage.getItem('BlockId');
        if (resultId) {
            JSON.parse(resultId);
            resultId = resultId.replace(/[^1-9]/gi, ' ');
            resultId = parseInt(resultId);
        }
        if (this.btnSaveElement) {
            this.btnSaveElement.onclick = function () {
                const userInfo = Auth.getUserInfo();
                if (!userInfo) {
                    location.href = '#/login';
                }
                try {
                    const result: Promise<any> = CustomHttp.request(config.host + '/categories/income/' + resultId, "PUT", {
                        title: that.inputNameElement?.value
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }

    }
}