import { prisma } from "../../lib/prisma";
import { VotesRepository, type CreateVoteDTO, type VoteWithParticipants } from "../votes-repository";

export class PrismaVotesRepository implements VotesRepository {
  async create(data: CreateVoteDTO): Promise<VoteWithParticipants> {

    if (data.participantIds.length < 2 || data.participantIds.length > 3) {
      throw new Error("Uma votação deve ter entre 2 e 3 participantes");
    }

    const vote = await prisma.vote.create({
      data: {
        title: data.title,
        userId: data.userId,
        participants: {
          create: data.participantIds.map(participantId => ({
            participantId: participantId
          }))
        }
      },
      include: {
        participants: {
          include: {
            participant: {
              select: {
                id: true,
                name: true,
                imageUrl: true
              }
            }
          }
        }
      }
    })

    return vote
  }

  async delete(): Promise<void> {
    await prisma.vote.deleteMany()
  }

  async getAll(): Promise<VoteWithParticipants[]> {
    const votes = await prisma.vote.findMany({
      include: {
        participants: {
          include: {
            participant: {
              select: {
                id: true,
                name: true,
                imageUrl: true
              }
            }
          }
        }
      }
    })
    

    return votes
  }

  async getById(id: string): Promise<VoteWithParticipants | null> {
    const vote = await prisma.vote.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            participant: {
              select: {
                id: true,
                name: true,
                imageUrl: true
              }
            }
          }
        }
      }
    })

    return vote
  }
}