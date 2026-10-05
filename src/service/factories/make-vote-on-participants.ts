import { PrismaUserVotesRepository } from "../../repositories/prisma/prisma-user-votes-repoitory"
import { VoteOnParticipants } from "../vote-on-participants"

export function makeVoteOnParticipants() {
  const userVotesRepository = new PrismaUserVotesRepository()
  const voteOnParticipants = new VoteOnParticipants(userVotesRepository)

  return voteOnParticipants

}