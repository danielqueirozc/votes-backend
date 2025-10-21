import { Participant, Prisma, Vote } from "@prisma/client";
import { VotesRepository } from "../repositories/votes-repository";

export interface CreateVoteServiceRequest {
    participantIds: string[]
    userId: string
    title: string
}

export interface CreateVoteServiceResponse {
    vote: {
        id: string
        title: string
        createdAt: Date
        participants: {
            participant: {
                id: string
                name: string
                imageUrl: string
            }
        }[]
    }
}

export class CreateVoteService {
    constructor(private votesRepository: VotesRepository) {}

    async execute({ 
        participantIds, 
        title, 
        userId 
    }: CreateVoteServiceRequest): Promise<CreateVoteServiceResponse> {
        
        // Validações de negócio
        if (!title.trim()) {
            throw new Error("Título da votação é obrigatório")
        }

        if (participantIds.length < 2) {
            throw new Error("Uma votação precisa ter pelo menos 2 participantes")
        }

        if (participantIds.length > 3) {
            throw new Error("Uma votação pode ter no máximo 3 participantes")
        }

        // Verificar se não há IDs duplicados
        const uniqueIds = [...new Set(participantIds)];
        if (uniqueIds.length !== participantIds.length) {
            throw new Error("Não é possível adicionar o mesmo participante mais de uma vez")
        }

        const vote = await this.votesRepository.create({
            title: title.trim(),
            userId,
            participantIds: uniqueIds
        })

        return { vote }
    }
}