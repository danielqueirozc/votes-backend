import { PrismaVotesRepository } from "../../repositories/prisma/prisma-votes-repository";
import { CreateVoteService } from "../create-vote";

export function MakeCreateVoteService() {

    const votesRepository = new PrismaVotesRepository()
    const createVoteService = new CreateVoteService(votesRepository)

    return createVoteService
}