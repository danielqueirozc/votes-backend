import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryParticipantsRepository } from "../repositories/in-memory/in-memory-participants-repository";
import { CreateParticipantsService } from "./create-participant";

let participantsRepository: InMemoryParticipantsRepository
let sut: CreateParticipantsService

describe('Create Participant Service', () => {
    beforeEach(() => {
        participantsRepository = new InMemoryParticipantsRepository()
        sut = new CreateParticipantsService(participantsRepository)
    })

    it('should be able to create a participant', async () => {
        const { participant } = await sut.execute({
           name: 'Participant 1',
           imageUrl: 'https://github.com/diego3g.png'
        })

        expect(participant.id).toEqual(expect.any(String))
    })
})