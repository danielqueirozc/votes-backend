import { Participant, Prisma } from "@prisma/client"

export interface ParticipantsRepository {
    Create({ name, imageUrl }: Prisma.ParticipantCreateInput): Promise<Participant>
    Delete(id: string): Promise<void>
    Edit({ id, name, imageUrl }: Prisma.ParticipantUpdateInput): Promise<Participant>
    GetAll(): Promise<Participant[]>
}