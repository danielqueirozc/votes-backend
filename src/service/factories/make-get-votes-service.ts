import { PrismaVotesRepository } from "../../repositories/prisma/prisma-votes-repository"
import { GetVotesService } from "../get-votes"

export function MakeGetVotesService() {
    const votesRepository = new PrismaVotesRepository()
    const getVotesService = new GetVotesService(votesRepository)

    return getVotesService
}