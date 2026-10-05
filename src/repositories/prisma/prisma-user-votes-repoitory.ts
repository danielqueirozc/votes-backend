import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import {UserVotesRepository, type CreateUserVoteData} from '../user-votes-repository'

export class PrismaUserVotesRepository implements UserVotesRepository {
  async create({ userId, voteId, participantId}: CreateUserVoteData) {
    const userVote = await prisma.userVote.create({ 
     data: {
      userId, 
      voteId, 
      participantId
     }
     })

    return userVote
  }

  async countByParticipant(participantId: string) {
    const count = await prisma.userVote.count({
      where: {
        participantId
      }
    })

    return count
  
  }

  async alreadyVoted(userId: string, voteId: string) {
    const exists = await prisma.userVote.findFirst({
      where: {
        userId,
        voteId
      }
    })

    return !!exists
  }
}