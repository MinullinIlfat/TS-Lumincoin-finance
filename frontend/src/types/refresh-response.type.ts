export type RefreshResponseType = {
    tokens: {
        accessToken?:string | null,
        refreshToken?:string | null,
    },
    error: boolean,
    message: string,
}