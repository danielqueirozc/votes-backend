import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { MakeDeleteParticipantService } from "../../service/factories/make-delete-participant-service"

interface DeleteParticipantParams {
  id: string;
}


export async function DeleteParticipant(request: FastifyRequest<{ Params: DeleteParticipantParams}>, reply: FastifyReply) {
 
  
  
  try {
    const { id } = request.params

    const deleteParticipantService = MakeDeleteParticipantService()
    await deleteParticipantService.execute({ id })

    return reply.status(200).send({ message: "Deletado com sucesso" })
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(409).send({ message: error.message })
    }
  }
}
