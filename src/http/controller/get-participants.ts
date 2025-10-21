import { FastifyRequest,FastifyReply } from "fastify";
import { MakeGetParticipantsService } from "../../service/factories/make-get-participants-service";

export async function GetParticipants(request:FastifyRequest ,reply: FastifyReply) {
   try {
    // await request.jwtVerify()

    const getParticipantsService = MakeGetParticipantsService()

    const { participants } = await getParticipantsService.execute()

    return reply.status(200).send({ participants })
   } catch (error) {
    if (error instanceof Error) {
        return reply.status(401).send({ message: error.message })
    }
   }
}