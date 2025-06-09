import { FastifyInstance } from "fastify";
import { Register } from "../controller/register";

export function appRoutes(app: FastifyInstance) {
    app.post('users', Register)
}
