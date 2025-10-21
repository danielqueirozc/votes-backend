import { Participant } from "@prisma/client";
import { ParticipantsRepository } from "../repositories/participants-repository";

interface GetParticipantsServiceResponse {
    participants: Participant[]
}

export class GetParticipantsService {
    constructor(private participantsRepository: ParticipantsRepository) {}

    async execute(): Promise<GetParticipantsServiceResponse> {
        const participants = await this.participantsRepository.GetAll()

        return { participants }
    }
}