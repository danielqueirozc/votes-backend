import type { FastifyRequest, FastifyReply} from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { NotifyAllClients } from '../../app'

export async function closeVoting(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    voteId: z.string()
  })

  try {
    await request.jwtVerify()

    const userId = (request.user as { sub: string }).sub

    const { voteId } = paramsSchema.parse(request.params)

    const vote = await prisma.vote.findUnique({
      where: {id: voteId}
    })

    if (!vote) {
      return reply.status(404).send({ messsage: 'Votação não encontrada' })
    }

    if (vote.userId !== userId) {
      return reply.status(403).send({ message: 'Apenas o criador pode encerrar a votação' })
    }

    if (vote.status === 'CLOSED') {
      return reply.status(400).send({ message: 'A votação já está encerrada' })
    }

    // Conta votos por participante
    const voteCounts = await prisma.userVote.groupBy({
      by: ['participantId'],
      where: { voteId },
      _count: { participantId: true },
      orderBy: { _count: { participantId: 'desc' } },
    })

    const maxVotes = voteCounts[0]._count.participantId
    const winners = voteCounts.filter(v => v._count.participantId === maxVotes)

    if (winners.length === 1) {
      // encontra o VoteParticipant correspondente
      const winnerParticipant = await prisma.voteParticipant.findFirst({
        where: { voteId, participantId: winners[0].participantId },
        include: {
          participant: {
            select: { name: true }
          }
        }
      })

      // !: eu garanto que esse valor não é null ou undefined

      await prisma.vote.update({
        where: { id: voteId },
        data: {
          status: 'CLOSED',
          winnerId: winnerParticipant!.id,
          winnerName: winnerParticipant!.participant.name  // agora sim
        }
      })


     
    } else {
      // empate — pega os VoteParticipants dos empatados
      const tiedParticipants = await prisma.voteParticipant.findMany({
        where: { voteId, participantId: { in: winners.map(w => w.participantId) } }
      })

      await prisma.vote.update({
        where: { id: voteId },
        data: {
          status: 'CLOSED',
          tied: { connect: tiedParticipants.map(p => ({ id: p.id })) }
        }
      })
    }

    // Notificar todos os clientes conectados sobre o encerramento da votação
    NotifyAllClients({
      event: 'vote_closed',
      data: {
        voteId,
        message: 'A votação foi encerrada pelo administrador.'
      }
    })

    reply.status(200).send({ message: 'Votação encerrada com sucesso' })
  } catch (error) {
    console.error('Erro ao encerrar a votação:', error)

    if (error instanceof z.ZodError) {
      return reply.status(400).send({ message: 'Dados inválidos', issues: error.issues })
    }

    if (error instanceof Error) {
      return reply.status(500).send({ message: error.message })
    }
  }
}