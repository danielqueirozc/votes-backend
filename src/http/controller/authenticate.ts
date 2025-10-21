import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MakeAuthenticateService } from "../../service/factories/make-authenticate-service";

export async function Authenticate(request: FastifyRequest, reply: FastifyReply) {
     const bodyZodSchema = z.object({
            email: z.string().email(),
            password: z.string().min(4),
        })

        const { email, password } = bodyZodSchema.parse(request.body)

        try {
            const authenticateService = MakeAuthenticateService()

            const { token } = await authenticateService.execute({ email, password })

            reply.setCookie('token', token, {
                path: '/',
                httpOnly: true,
                secure: false, // só em HTTPS
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 60: 1 minuto, 60: 1 hora, 24: 1 dia
            })

            return reply.status(200).send({ message: 'Autenticado com sucesso', token })

        } catch (error) {
            if (error instanceof Error) {
                return reply.status(400).send({ message: error.message })
            }

            return reply.status(500).send({ message: 'Internal server error' })
        }
}