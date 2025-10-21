import { type Participant } from "@prisma/client";
import type { ParticipantsRepository } from "../repositories/participants-repository";

interface EditParticipantRequest {
  id: string,
  name: string,
  imageUrl: string
}

interface EditParticipantResponse {
  participant: Participant
}

export class EditParticipants {
  constructor (private participantsRepository: ParticipantsRepository) {}

  async execute({ id, name, imageUrl }: EditParticipantRequest): Promise<EditParticipantResponse> {
    const participant = await this.participantsRepository.Edit({ id, name, imageUrl })

    return { participant }
  }
}