import {  FastifyRequest, FastifyReply } from "fastify";
import { MakeGetVotesService } from "../../service/factories/make-get-votes-service";

export async function GetVotes(response: FastifyRequest, reply: FastifyReply) {
    const getVotesService = MakeGetVotesService()

    const votes = await getVotesService.execute()

    return reply.status(200).send(votes)
}