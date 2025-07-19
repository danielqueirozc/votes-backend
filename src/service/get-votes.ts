import { Vote } from "@prisma/client";
import { VotesRepository } from "../repositories/votes-repository";

 interface GetVotesResponse {
    votes: Vote[]
 }

export class GetVotesService {
    constructor(private votesRepository: VotesRepository) {}

    async execute(): Promise<GetVotesResponse> {
        const votes = await this.votesRepository.getAll()

        return {
            votes,
        }
    }
}