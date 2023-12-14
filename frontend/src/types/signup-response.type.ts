export type SignupResponseType = {
    user?: {
        id: number,
        email: string,
        name: string,
        lastName: string,
    },
    error: boolean,
    message: string
}