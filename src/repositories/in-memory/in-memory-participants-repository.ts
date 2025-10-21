import { Participant, Prisma } from "@prisma/client";
import { ParticipantsRepository } from "../participants-repository";
import { randomUUID } from "crypto";

export class InMemoryParticipantsRepository implements ParticipantsRepository {
    public participants: Participant[] = []

    async Create({ name, imageUrl }: Prisma.ParticipantCreateInput): Promise<Participant> {
        const participant = {
            id: randomUUID(),
            name,
            imageUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        this.participants.push(participant)

        return participant
    }

    async Delete(id: string): Promise<void> {
        const participantIndex = this.participants.findIndex(participant => participant.id === id)

        this.participants.splice(participantIndex, 1)
    }

    async Edit({ id, name, imageUrl }: Prisma.ParticipantUpdateInput): Promise<Participant> { 

    const participantIndex = this.participants.findIndex(participant => participant.id === id)

    if (participantIndex === -1) {
        throw new Error('Participant not found')
    }

    const updatedParticipant: Participant = {
        ...this.participants[participantIndex],
        name: name !== undefined ? String(name) : this.participants[participantIndex].name,
        imageUrl: imageUrl !== undefined ? String(imageUrl) : this.participants[participantIndex].imageUrl,
        updatedAt: new Date()
    }

    this.participants[participantIndex] = updatedParticipant

    return updatedParticipant
}

    async GetAll(): Promise<Participant[]> {
        return this.participants
    }
}