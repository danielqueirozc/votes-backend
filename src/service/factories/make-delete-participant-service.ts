import { PrismaParticipantsRepository } from "../../repositories/prisma/prisma-participants-repository"
import { DeleteParticipant } from "../delete-participant"

export function MakeDeleteParticipantService() {
  const participantsRepository = new PrismaParticipantsRepository()
  const deleteParticipantService = new DeleteParticipant(participantsRepository)

  return deleteParticipantService
}