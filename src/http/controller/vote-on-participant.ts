import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { NotifyAllClients } from "../../app";
import { prisma } from "../../lib/prisma";

export async function voteOnParticipants(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    voteId: z.string(),
    participantId: z.string(),
    anonymousId: z.string().optional()
  })

  try {
    const { voteId, participantId, anonymousId } = bodySchema.parse(request.body)

    // Verifica se a votação existe e está ativa
    const vote = await prisma.vote.findUnique({
      where: { id: voteId }
    })

    if (!vote) {
      return reply.status(404).send({ message: "Votação não encontrada" })
    }

    if (vote.status === 'CLOSED') {
      return reply.status(400).send({ 
        message: "Esta votação já foi encerrada" 
      })
    }

    let userId: string | null = null

    // tenta pegar o userId do token (se estiver logado)
    try {
      await request.jwtVerify()
      userId = (request.user as { sub: string }).sub
    } catch {
      // não está logado
      if (!anonymousId) {
        return reply.status(400).send({ 
          message: "anonymousId é obrigatório para votação anônima" 
        })
      }
    }

    // Verifica se já votou
    const whereConditions = []
    
    if (userId) {
      whereConditions.push({ userId, voteId }) // se for true ele puxa os votos com userId + voteId
    }
    
    if (anonymousId) {
      whereConditions.push({ anonymousId, voteId })
    }

    const existingVote = await prisma.userVote.findFirst({
      where: {
        voteId,
        OR: whereConditions
      }
    })

    if (existingVote) {
      return reply.status(409).send({ 
        message: "Você já votou nesta votação" 
      })
    }

    // Cria o voto
    const voteData: any = {
      voteId,
      participantId
    }

    // Adiciona userId OU anonymousId
    if (userId) {
      voteData.userId = userId
    }
    
    if (anonymousId) {
      voteData.anonymousId = anonymousId
    }

    await prisma.userVote.create({
      data: voteData
    })

    // Busca os dados atualizados COM CONTAGEM DE VOTOS
    const updatedVote = await prisma.vote.findUnique({
      where: { id: voteId },
      include: {
        participants: {
          include: {
            participant: true
          }
        }
      }
    })

    // Conta os votos de cada participante
    const participantsWithVotes = await Promise.all(
      (updatedVote?.participants ?? []).map(async (vp) => {
        const voteCount = await prisma.userVote.count({
          where: {
            voteId: voteId,
            participantId: vp.participant.id
          }
        })

        return {
          participant: {
            id: vp.participant.id,
            name: vp.participant.name,
            imageUrl: vp.participant.imageUrl
          },
          votes: voteCount
        }
      })
    )

    console.log('dados que serão enviados via WebSocket:', participantsWithVotes)

    // Notifica todos os clientes com os dados CORRETOS
    NotifyAllClients({
      event: "vote_update",
      data: {
        voteId,
        participants: participantsWithVotes
      }
    })
    
    reply.status(201).send({ 
      message: "Voto registrado com sucesso"
    })

  } catch (error) {
    console.error('Erro ao votar:', error)
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ message: "Dados inválidos", errors: error.errors })
    }
    if (error instanceof Error) {
      return reply.status(500).send({ message: error.message })
    }
  }
}