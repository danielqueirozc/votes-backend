import { Prisma } from "@prisma/client"
import { ParticipantsRepository } from "../participants-repository"
import { prisma } from "../../lib/prisma"

export class PrismaParticipantsRepository implements ParticipantsRepository {
    async Create({ name, imageUrl }: Prisma.ParticipantCreateInput) {
        const participant = await prisma.participant.create({
            data: {
                name,
                imageUrl
            }
        })

        return participant
    }

    async Delete(participantId: string) {
        await prisma.participant.delete({
            where: {
                id: participantId
            }
        })
    }

    async Edit({ id, name, imageUrl }: Prisma.ParticipantUpdateInput) {
        const participant = await prisma.participant.update({
            where: {
                id: id as string, 
            },
            data: {
                name,
                imageUrl
            }
        })

        return participant
    }

    async GetAll() {
        const participants = await prisma.participant.findMany()

        return participants
    }
}