export interface TokenProvider {
    sign(payload: object): string
}