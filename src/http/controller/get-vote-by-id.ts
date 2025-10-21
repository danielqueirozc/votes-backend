import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MakeGetVoteByIdService } from "../../service/factories/make-get-vote-by-id";

export async function getVoteById(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string()
  })


  try {
    const { id } = paramsSchema.parse(req.params)

    const getVoteByIdService = MakeGetVoteByIdService()

    const vote =await getVoteByIdService.execute({ id })

    if (!vote) {
      return reply.status(404).send({ message: "Vote not found" })
    }

    reply.status(200).send(vote)
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(409).send({ message: error.message })
    }

    return reply.status(500).send({ message: "Internal server error" })
  }
}