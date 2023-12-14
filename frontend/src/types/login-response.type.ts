export type LoginResponseType = {
    user: {
        id: number,
        name: string,
        lastName: string,
    },
    tokens: {
        accessToken:string,
        refreshToken:string,
    },
    error: boolean,
    message: string
}