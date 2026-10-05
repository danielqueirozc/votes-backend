import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MakeRegisterService } from "../../service/factories/make-register-service";

export async function Register(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(4),
    })

    const { name, email, password } = bodySchema.parse(request.body)

    try {
        const registerService = MakeRegisterService()
        await registerService.execute({ name, email, password })
        
        return reply.status(201).send()
        
    } catch (error) {
        if (error instanceof Error) {
            // Se for erro de usuário, já existe
            if (error.message === 'User already exists.') {
                return reply.status(409).send({ message: error.message })
            }
            
            // Outros erros = 500
            console.error('Erro no registro:', error)
            return reply.status(500).send({ message: 'Internal server error' })
        }
    }
}