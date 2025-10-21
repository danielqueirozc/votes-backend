import { PrismaVotesRepository } from "../../repositories/prisma/prisma-votes-repository"
import { DeleteVoteService } from "../delete-vote"

export function MakeDeleteVoteService() {
  const votesRepository = new PrismaVotesRepository()
  const deleteVoteService = new DeleteVoteService(votesRepository)

  return deleteVoteService
}