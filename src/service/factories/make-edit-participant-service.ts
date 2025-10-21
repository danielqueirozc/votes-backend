import { PrismaParticipantsRepository } from "../../repositories/prisma/prisma-participants-repository";
import { EditParticipants } from "../edit-participant";

export function MakeEditParticipantService() {
  const participantsRepository = new PrismaParticipantsRepository()
  const editParticipantService = new EditParticipants(participantsRepository)

  return editParticipantService
}