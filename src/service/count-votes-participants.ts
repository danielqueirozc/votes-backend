import type { UserVotesRepository } from "../repositories/user-votes-repository";

interface CountVotesParticipantsRequest {
  participantId: string
}

interface CountVotesParticipantsReply {
  votesCount: number
}

export class CountVotesParticipants {
  constructor(private userVotesRepository: UserVotesRepository) {}

  async execute({ participantId }: CountVotesParticipantsRequest): Promise<CountVotesParticipantsReply> {
    const votesCount = await this.userVotesRepository.countByParticipant(participantId)

    return { votesCount }
  }
}