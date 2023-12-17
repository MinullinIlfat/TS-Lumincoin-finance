"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCategoryExpenses = void 0;
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
class CreateCategoryExpenses {
    constructor() {
        this.inputNameCreateExpense = document.getElementById('input-name-create-expense');
        this.createCategoryExpenseBtn = document.getElementById('create-category-expense-btn');
        this.createCategoryIncome();
    }
    createCategoryIncome() {
        const that = this;
        if (this.createCategoryExpenseBtn) {
            this.createCategoryExpenseBtn.onclick = function () {
                var _a;
                let categoryName = (_a = that.inputNameCreateExpense) === null || _a === void 0 ? void 0 : _a.value;
                try {
                    const result = custom_http_1.CustomHttp.request(config_1.default.host + '/categories/expense', "POST", {
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
exports.CreateCategoryExpenses = CreateCategoryExpenses;
//# sourceMappingURL=createCategoryExpenses.js.map