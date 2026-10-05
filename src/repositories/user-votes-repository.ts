import { UserVote } from "@prisma/client";

export interface CreateUserVoteData {
  userId: string
  voteId: string
  participantId: string
}

export interface UserVotesRepository {
    create(data: {
      userId: string
      voteId: string
      participantId: string
    }): Promise<UserVote>

    countByParticipant(participantId: string): Promise<number>
    alreadyVoted(userId: string, voteId: string): Promise<boolean>
}