import type { Vote } from "@prisma/client"
import type { VotesRepository } from "../repositories/votes-repository"

interface GetVoteByIdRequest {
  id: string
}

interface GetVoteByIdResponse {
  vote: Vote
}

export class GetVoteById {
  constructor(private votesRepository: VotesRepository) {}

  async execute({ id }: GetVoteByIdRequest): Promise<GetVoteByIdResponse> {
    const vote = await this.votesRepository.getById(id)

    if (!vote) {
      throw new Error('Vote not found.')
    }

    return {
      vote
    }
  } 
}