import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MakeRegisterService } from "../../service/factories/make-register-service";

export function Register(request: FastifyRequest, reply: FastifyReply) {
    const bodyZodSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(4),
    })

    const { name, email, password } = bodyZodSchema.parse(request.body)

    try {
        const registerService = MakeRegisterService()

        registerService.execute({ name, email, password })
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(400).send({ message: error.message })
        }
    }

}