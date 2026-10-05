import type { UserVote } from "@prisma/client"
import type { UserVotesRepository } from "../repositories/user-votes-repository"

interface VoteOnParticipantsRequest {
  userId: string
  voteId: string
  participantId: string
}

interface VoteOnParticipantsResponse {
  userVote: UserVote
}

export class VoteOnParticipants {
  constructor (private userVotesRepository: UserVotesRepository) {}

  async execute({ userId, voteId, participantId }: VoteOnParticipantsRequest): Promise<VoteOnParticipantsResponse> {
    const alreadyVoted = await this.userVotesRepository.alreadyVoted(userId, voteId)

    if (alreadyVoted) {
      throw new Error("Usuário já votou nesta votação")
    }

    const userVote = await this.userVotesRepository.create({ userId, voteId, participantId })

    return { userVote }
  }
}