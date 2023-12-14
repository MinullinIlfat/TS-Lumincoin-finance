import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {FormFieldType} from "../types/form-field.type";
import {SignupResponseType} from "../types/signup-response.type";
import {LoginResponseType} from "../types/login-response.type";


export class SignUp {
    readonly processElement: HTMLElement | null;
    readonly agreeElement: HTMLInputElement | null;
    readonly page: 'signup' | 'login';
    private fields: FormFieldType[] = [];

    constructor(page: 'signup' | 'login') {
        this.processElement = null;
        this.agreeElement = null;
        this.page = page;
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false
            },
        ];

        if (this.page === 'signup') {
            this.fields.unshift(
                {
                    name: 'name',
                    id: 'name',
                    element: null,
                    regex: /^[А-Я][а-я]+\s*$/,
                    valid: false
                },
                {
                    name: 'confirm-password',
                    id: 'confirm-password',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false
                }
            )
        }

        const that: SignUp = this;
        this.fields.forEach((item:FormFieldType) => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            if (item.element) {
                item.element.onchange = function () {
                    that.validateField.call(that, item, <HTMLInputElement>this);
                }
            }
        });

        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.onclick = function () {
                that.processForm()
            }
        }


        if (this.page === 'login') {
            this.agreeElement = document.getElementById('flexCheckDefault') as HTMLInputElement;
            if (this.agreeElement) {
                this.agreeElement.onchange = function () {
                    that.validateForm();
                }
            }
        }
    }

    private validateField(field: FormFieldType, element: HTMLInputElement): void {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.setProperty("border", "1px solid red", "important")
            field.valid = false;
        } else {
            element.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }

    private validateForm(): boolean {
        const confirmPassword: HTMLInputElement | null = document.getElementById('confirm-password') as HTMLInputElement;
        const password: HTMLInputElement | null = document.getElementById('password') as HTMLInputElement;

        const validForm: boolean = this.fields.every(item => item.valid);
        const isValid: boolean = this.agreeElement ? this.agreeElement.checked && validForm : validForm;
        if (this.processElement) {
            if (isValid) {
                this.processElement.removeAttribute('disabled');
            } else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
            if (this.page === 'signup') {
                if (confirmPassword.value !== password.value) {
                    password.style.setProperty("border", "1px solid red", "important")
                    confirmPassword.style.setProperty("border", "1px solid red", "important")
                    this.processElement.setAttribute('disabled', 'disabled');
                } else {
                    password.removeAttribute('style');
                    confirmPassword.removeAttribute('style');
                    this.processElement.removeAttribute('disabled');
                }
            }
        }


        return isValid;
    }

    private async processForm(): Promise<void> {
        if (this.validateForm()) {

            const email = this.fields.find(item => item.name === 'email')?.element?.value;
            const password = this.fields.find(item => item.name === 'password')?.element?.value;
            if (this.page === 'signup') {
                const passwordRepeat = this.fields.find(item => item.name === 'confirm-password')?.element?.value;
                try {
                    const result: SignupResponseType = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'name')?.element?.value,
                        lastName: this.fields.find(item => item.name === 'name')?.element?.value,
                        email: email,
                        password: password,
                        passwordRepeat: passwordRepeat,
                    });
                    if (result) {
                        if (!result.user) {
                            console.log(123);
                        }
                    }
                } catch (error) {
                    console.log(error);
                    return;
                }
            }

            try {
                const result: LoginResponseType = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                });
                if (result) {
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken
                        || !result.user.name || !result.user.id || !result.user.lastName) {
                        throw new Error(result.message);
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        fullName: result.user.name,
                        userId: result.user.id
                    })
                    location.href = '#/';
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}
