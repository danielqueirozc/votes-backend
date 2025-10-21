import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MakeCreateParticipantService } from "../../service/factories/make-create-participant-service";

export async function CreateParticipant(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        name: z.string(),
        imageUrl: z.string()
    })

    const { name, imageUrl } = bodySchema.parse(request.body)

    try {
        // await request.jwtVerify()

        const createParticipantService = MakeCreateParticipantService()

        await createParticipantService.execute({ name, imageUrl })
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(409).send({ message: error.message })
        }
    }
}