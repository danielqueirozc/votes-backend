import { beforeEach, describe, expect, it } from "vitest"
import { DeleteParticipant } from "./delete-participant"
import { InMemoryParticipantsRepository } from "../repositories/in-memory/in-memory-participants-repository"

let sut:  DeleteParticipant
let participantRepository: InMemoryParticipantsRepository

describe('Delete Participant Service', () => {
  beforeEach(() => {
    participantRepository = new InMemoryParticipantsRepository()
    sut = new DeleteParticipant(participantRepository)
  })

  it('should be able to delete a participant', async () => {
    const createdParticipant = await participantRepository.Create({
      name: 'Participant 1',
      imageUrl: 'https://github.com/danielqueirozc.png'
    })

    const deletedParticipant = await sut.execute({
      id: createdParticipant.id
    })
  })
})