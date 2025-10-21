import { Participant } from "@prisma/client";
import { ParticipantsRepository } from "../repositories/participants-repository";

interface CreateParticipantsServiceRequest {
    name: string;
    imageUrl: string;
}

interface CreateParticipantsServiceResponse {
    participant: Participant
}

export class CreateParticipantsService {
    constructor(private participantsRepository: ParticipantsRepository) {}

    async execute({ name, imageUrl }: CreateParticipantsServiceRequest): Promise<CreateParticipantsServiceResponse> {
        const participant = await this.participantsRepository.Create({ name, imageUrl })

        return { participant }
    }
}