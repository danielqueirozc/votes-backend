import { PrismaParticipantsRepository } from "../../repositories/prisma/prisma-participants-repository"
import { GetParticipantsService } from "../get-participants"

export function MakeGetParticipantsService() {
    const ParticipantsRepository = new PrismaParticipantsRepository()
    const getParticipantsService = new GetParticipantsService(ParticipantsRepository)

    return getParticipantsService
}