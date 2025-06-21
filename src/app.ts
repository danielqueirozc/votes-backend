import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import cors from '@fastify/cors'

import { appRoutes } from "./http/routes/routes";

import 'dotenv/config'

export const app = fastify({ logger: true })

app.register(appRoutes)

app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'secret',
    cookie: {
        cookieName: 'token',
        signed: false
    }
})

app.register(fastifyCookie)
app.register(cors, {
    origin: true
})