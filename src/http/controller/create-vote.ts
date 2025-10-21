import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MakeCreateVoteService } from "../../service/factories/make-create-vote-service";
import { NotifyAllClients } from "../../app";

export async function CreateVote(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        title: z.string().min(1, "Título é obrigatório"),
        participantIds: z.array(z.string().uuid("ID do participante deve ser um UUID válido"))
            .min(2, "É necessário selecionar pelo menos 2 participantes")
            .max(3, "É possível selecionar no máximo 3 participantes"),
    })

    try {
        // Verificar se o usuário está autenticado
        await request.jwtVerify()

        // Extrair dados do body
        const { title, participantIds } = bodySchema.parse(request.body)

        // Extrair userId do token JWT
        const userId = (request.user as { sub: string }).sub

        // Instanciar o service
        const createVoteService = MakeCreateVoteService()

        // Executar criação do voto
        const { vote } = await createVoteService.execute({ 
            title, 
            participantIds, 
            userId 
        })

        NotifyAllClients({
            event: "new_vote",
            data: {
                id: vote.id,
                title: vote.title,
                createdAt: vote.createdAt,
                participantsCount: vote.participants.length,
                participants: vote.participants.map(vp => ({
                id: vp.participant.id,
                name: vp.participant.name,
                imageUrl: vp.participant.imageUrl
                }))
            }
        })  

        // Retornar sucesso com os dados do voto criado
        return reply.status(201).send({
            message: "Votação criada com sucesso",
            vote: {
                id: vote.id,
                title: vote.title,
                createdAt: vote.createdAt,
                participantsCount: vote.participants.length,
                participants: vote.participants.map(vp => ({
                    id: vp.participant.id,
                    name: vp.participant.name,
                    imageUrl: vp.participant.imageUrl
                }))
            }
        })

    } catch (error) {
        console.error("Erro ao criar votação:", error);

        // Erro de validação do Zod
        if (error instanceof z.ZodError) {
            return reply.status(400).send({
                message: "Dados inválidos",
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }

        // Erro de autenticação JWT
        if (error instanceof Error && error.message.includes('jwt')) {
            return reply.status(401).send({
                message: "Token inválido ou expirado"
            });
        }

        // Outros erros do service (ex: validação de negócio)
        if (error instanceof Error) {
            return reply.status(400).send({
                message: error.message
            })
        }

        // Erro genérico
        return reply.status(500).send({
            message: "Erro interno do servidor"
        })
    }
}