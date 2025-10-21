import { PrismaVotesRepository } from "../../repositories/prisma/prisma-votes-repository"
import { GetVoteById } from "../get-vote-by-id"

export function MakeGetVoteByIdService() {
  const votesRepository = new PrismaVotesRepository()
  const getVoteByIdService = new GetVoteById(votesRepository)

  return getVoteByIdService
}