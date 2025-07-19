import { FastifyJwtProvider } from "../../providers/fastify-jwt-provider";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { AuthenticateService } from "../authenticate";

export function MakeAuthenticateService() {
    const usersRepository = new PrismaUsersRepository()
    const tokenProvider = new FastifyJwtProvider()
    const authenticateService = new AuthenticateService(usersRepository, tokenProvider)


    return authenticateService
}