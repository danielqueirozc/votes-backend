import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export function Register(request: FastifyRequest, reply: FastifyReply) {
    const bodyZodSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(4),
    })

    const { name, email, password } = bodyZodSchema.parse(request.body)

}