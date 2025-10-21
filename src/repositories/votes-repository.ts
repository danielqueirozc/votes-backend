import { Prisma, Vote } from "@prisma/client";

export interface CreateVoteDTO {
    title: string,
    userId: string,
    participantIds: string[]
}

export interface VoteWithParticipants extends Vote {
    participants: {
    participant: {
      id: string;
      name: string;
      imageUrl: string;
    }
  }[]
}

export interface VotesRepository {
    create(data: CreateVoteDTO): Promise<VoteWithParticipants>
    delete(): Promise<void>
    // Edit(id: string, data: Prisma.VoteUpdateInput): Promise<void>
    getAll(): Promise<VoteWithParticipants[]>
    getById(id: string): Promise<VoteWithParticipants | null>
}