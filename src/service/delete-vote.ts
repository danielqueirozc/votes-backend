import type { VotesRepository } from "../repositories/votes-repository";

export class DeleteVoteService {
  constructor (private votesRepository: VotesRepository) {}

  async execute(): Promise<void> {
    await this.votesRepository.delete()
  }
}