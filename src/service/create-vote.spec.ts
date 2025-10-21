import { describe, expect, it, beforeEach } from "vitest";
import { CreateVoteService } from "./create-vote";
import { InMemoryCreateVoteRepository } from "../repositories/in-memory/in-memory-create-vote-repository";
import { InMemoryParticipantsRepository } from "../repositories/in-memory/in-memory-participants-repository";

let votesRepository: InMemoryCreateVoteRepository
let participantsRepository: InMemoryParticipantsRepository
let sut: CreateVoteService

describe('Create Vote Service', () => {
    beforeEach(() => {
        votesRepository = new InMemoryCreateVoteRepository()
        participantsRepository = new InMemoryParticipantsRepository()
        sut = new CreateVoteService(votesRepository)
    })

    it('should be able to create a vote', async () => {
        const createdParticipant = await participantsRepository.Create({
            name: 'Participant 1',
            imageUrl: 'https://github.com/diego3g.png'
        })

        const { vote } = await sut.execute({
            participantId: createdParticipant.id,
            title: 'Vote 1',
            userId: 'user-1'
        })

        expect(vote.id).toEqual(expect.any(String))
    })
})
