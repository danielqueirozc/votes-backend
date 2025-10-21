import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MakeDeleteVoteService } from "../../service/factories/make-delete-vote-service";

export async function DeleteVotes(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    id: z.string(),
  })
  

  try {
  await request.jwtVerify()

  const deleteVoteService = MakeDeleteVoteService()

  await deleteVoteService.execute()

  return reply.status(204).send()
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(409).send({ message: error.message })
    }
  }
}
