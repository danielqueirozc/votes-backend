import { PrismaParticipantsRepository } from "../../repositories/prisma/prisma-participants-repository";
import { CreateParticipantsService } from "../create-participant";

export function MakeCreateParticipantService() {

    const particpnatsRepository = new PrismaParticipantsRepository()
    const createParticipantervice = new CreateParticipantsService(particpnatsRepository)

    return createParticipantervice
}