"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCategoryIncome = void 0;
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
class CreateCategoryIncome {
    constructor() {
        this.inputNameCreateIncome = document.getElementById('input-name-create-income');
        this.createCategoryIncomeBtn = document.getElementById('create-category-income-btn');
        this.createCategoryIncome();
    }
    createCategoryIncome() {
        const that = this;
        if (this.createCategoryIncomeBtn) {
            this.createCategoryIncomeBtn.onclick = function () {
                var _a;
                let categoryName = (_a = that.inputNameCreateIncome) === null || _a === void 0 ? void 0 : _a.value;
                try {
                    const result = custom_http_1.CustomHttp.request(config_1.default.host + '/categories/income', "POST", {
                        title: categoryName
                    });
                }
                catch (error) {
                    console.log(error);
                }
            };
        }
    }
}
exports.CreateCategoryIncome = CreateCategoryIncome;
//# sourceMappingURL=createCategoryIncome.js.map