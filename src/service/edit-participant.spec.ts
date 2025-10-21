import { beforeEach, describe, expect, it } from "vitest"
import { EditParticipants } from "./edit-participant"
import { InMemoryParticipantsRepository } from "../repositories/in-memory/in-memory-participants-repository"

let sut: EditParticipants
let participantRepository: InMemoryParticipantsRepository
let createdParticipant: InMemoryParticipantsRepository
describe('Edit Participant Service', () => {
  beforeEach(() => {
    participantRepository = new InMemoryParticipantsRepository()
    sut = new EditParticipants(participantRepository)
  })

  it('should be able to edit a participant', async () => {
    const createParticipant = await participantRepository.Create({
      name: 'Participant 1',
      imageUrl: 'https://github.com/danielqueirozc.png'
    })

    const editedParticipant = await sut.execute({
      id: createParticipant.id,
      name: 'Participant 2',
      imageUrl: 'https://github.com/danielqueirozc.png'
    })
    
    expect(editedParticipant.participant.name).toEqual('Participant 2')
  })
})