import { Prisma, Vote } from "@prisma/client";
import { VotesRepository } from "../repositories/votes-repository";

export interface CreateVoteServiceRequest {
    name: string
    imageUrl: string
    userId: string
}

export interface CreateVoteServiceResponse {
    vote: Vote
}

export class CreateVoteService {
    constructor(private votesRepository: VotesRepository) {}

    async execute({name, imageUrl, userId}: CreateVoteServiceRequest): Promise<CreateVoteServiceResponse> {
        const vote = await this.votesRepository.create({
            user: {
                connect: {
                    id: userId
                }
            },
            name,
            imageUrl
        })

        return {
            vote,
        }
    }
}