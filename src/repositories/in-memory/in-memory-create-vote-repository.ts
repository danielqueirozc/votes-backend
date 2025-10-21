import { Prisma, Vote } from "@prisma/client";
import { VotesRepository } from "../votes-repository";
import { randomUUID } from "crypto";

export class InMemoryCreateVoteRepository implements VotesRepository {
    public votes: Vote[] = []

  async create(data: Prisma.VoteCreateInput): Promise<Vote> {
    if (!data.user?.connect?.id || !data.participant?.connect?.id) {
      throw new Error("userId ou participantId ausente no VoteCreateInput");
    }

    const vote: Vote = {
      id: randomUUID(),
      title: data.title,
      userId: data.user.connect.id,
      participantId: data.participant.connect.id,
      createdAt: new Date(),
    }

    this.votes.push(vote)
    return vote
  }

  async getAll(): Promise<Vote[]> {
    return this.votes
  }

}