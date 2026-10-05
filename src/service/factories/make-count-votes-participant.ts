import { PrismaUserVotesRepository } from "../../repositories/prisma/prisma-user-votes-repoitory"
import { CountVotesParticipants } from "../count-votes-participants"

export function makeCountVotesParticipant() {
  const userVotesRepository = new PrismaUserVotesRepository()
  const countVotesParticipants = new CountVotesParticipants(userVotesRepository)

  return countVotesParticipants
}