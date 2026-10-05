import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCountVotesParticipant } from "../../service/factories/make-count-votes-participant";

export async function countVotesParticipants(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    participantId: z.string()
  })

  try {
    const { participantId } = paramsSchema.parse(request.params)

    const countVotesParticipantsService = makeCountVotesParticipant()

    const result = await countVotesParticipantsService.execute({ participantId })

    reply.status(200).send({ result })
    
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(409).send({ message: error.message })
    }
  }
}