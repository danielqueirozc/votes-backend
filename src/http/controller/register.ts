import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export function Register(request: FastifyRequest, reply: FastifyReply) {
    const registerZodSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(4),
    })

    
}