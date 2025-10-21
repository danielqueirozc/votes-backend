import type { ParticipantsRepository } from "../repositories/participants-repository"

interface DeleteParticipantRequest {
  id: string
}

interface DeleteParticipantResponse {
  status: number
  message: string
}

export class DeleteParticipant {
  constructor (private participantsRepository: ParticipantsRepository) {}

  async execute(id: DeleteParticipantRequest): Promise<DeleteParticipantResponse> {
    await this.participantsRepository.Delete(id.id)

    return { status: 200, message: 'Participant deleted' }
  }
}