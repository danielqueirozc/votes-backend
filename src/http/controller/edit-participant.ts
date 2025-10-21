import { FastifyRequest, FastifyReply } from "fastify"
import { MakeEditParticipantService } from "../../service/factories/make-edit-participant-service"
import { z } from "zod"

export function EditParticipant(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string(),
    imageUrl: z.string(),
  })
  
  const { name, imageUrl } = bodySchema.parse(request.body)

  try {
    const editParticipantService = MakeEditParticipantService()

    const id = (request.user as { sub: string }).sub

    editParticipantService.execute({ id, name, imageUrl })
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(409).send({ message: error.message })
    }
  }
}