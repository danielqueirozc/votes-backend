import { TokenProvider } from "../@types/token-provider";
import { app } from "../app";

export class FastifyJwtProvider implements TokenProvider {
    sign(payload: object): string {
        return app.jwt.sign(payload)
    }
}