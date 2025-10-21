import { FastifyInstance } from "fastify";
import { Register } from "../controller/register";
import { CreateParticipant } from "../controller/create-participant";
import { GetVotes } from "../controller/get-votes";
import { CreateVote } from "../controller/create-vote";
import { GetParticipants } from "../controller/get-participants";
import { Authenticate } from "../controller/authenticate";
import { EditParticipant } from "../controller/edit-participant";
import { DeleteParticipant } from "../controller/delete-participant";
import { getVoteById } from "../controller/get-vote-by-id";
import { uploadImage } from "../controller/upload-image";
import { DeleteVotes } from "../controller/delete-vote";

export function appRoutes(app: FastifyInstance) {
    app.post('/users', Register)
    app.post('/sessions', Authenticate)
    app.post('/create-participant', CreateParticipant)
    app.get('/list-participants', GetParticipants)
    app.get('/vote/:id', getVoteById)
    app.post('/create-vote', CreateVote)
    app.get('/list-votes', GetVotes),
    app.put('/edit-participant', EditParticipant),
    app.delete('/delete-participant/:id', DeleteParticipant)
    app.post('/upload', uploadImage)
    app.delete('/delete-votes', DeleteVotes)
}
