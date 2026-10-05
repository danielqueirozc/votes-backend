import 'dotenv/config'
import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { appRoutes } from "./http/routes/routes";
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import fastifyMultipart from "@fastify/multipart";
import websocket from '@fastify/websocket'
import path from "path";
import fs from "fs";

const uploadsDir = path.resolve(process.cwd(), "uploads")

// Verifica se a pasta existe
if (!fs.existsSync(uploadsDir)) { 
  fs.mkdirSync(uploadsDir, { recursive: true })
} else {
  console.log("pasta uploads existe:", uploadsDir)
}

const existingFiles = fs.readdirSync(uploadsDir)
console.log("📁 arquivos na pasta uploads:", existingFiles.length > 0 ? existingFiles : "pasta vazia")

export const app = fastify({ 
  logger: true,
  bodyLimit: 10 * 1024 * 1024, // 10MB

  // configurações do WebSocket
  connectionTimeout: 0,
  keepAliveTimeout: 72000
})

// conjunto para gerenciar clientes WebSocket
// Set (uma estrutura de dados que armazena itens únicos)

app.register(cors, {
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
})

//////////// WebSocket /////////////

app.register(websocket, {
  options: {
    maxPayload: 1048576, // 1MB
    clientTracking: true
  }
})

export function NotifyAllClients(data: unknown) {
  let successCount = 0
  let errorCount = 0
  
  for (const client of clients) {
    try {
      // readyState: 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED
      if (client.readyState === 1) {
        client.send(JSON.stringify(data))
        successCount++
      } else {
        clients.delete(client)
      }
    } catch (error) {
      clients.delete(client)
      errorCount++
    }
  }
  
}

const clients = new Set<any>()

app.register(async (fastifyInstance) => {
  fastifyInstance.get('/ws', { websocket: true }, (socket: any, request: any) => {
    console.log('cliente WebSocket conectado!')
    console.log('IP:', request.socket.remoteAddress)
    
    clients.add(socket)
    
    // mensagem de boas-vindas APÓS adicionar aos clientes
    try {
      socket.send(JSON.stringify({
        event: 'connected',
        message: 'Conectado ao servidor WebSocket',
        timestamp: new Date().toISOString()
      }))
    } catch (error) {
      console.error('erro ao enviar mensagem de boas-vindas:', error)
    }
    
    socket.on('message', async (rawMessage: any) => {
      const text = rawMessage.toString()
      
      let message
      try {
        message = JSON.parse(text)
      } catch (e) {
        console.error("mensagem inválida, não é JSON:", text)
        return
      }
      
      if (message.event === 'new_vote') {
        const { voteId, selectedParticipantId, participantName } = message.data
        
        console.log("🗳️ Novo voto recebido WS:")
        console.log("voteId:", voteId)
        console.log("participantId:", selectedParticipantId)
        console.log("participantName:", participantName)
        
        //  envia atualização para TODOS os clientes conectados
        NotifyAllClients({
          event: "vote_update",
          data: {
            voteId,
            participantId: selectedParticipantId,
            participantName
          }
        })
        
        return
      }
      
      // fallback: echo (para testes)
      socket.send(JSON.stringify({
        event: 'echo',
        data: text
      }))
    })
    
    socket.on('close', () => {
      console.log('❌ Cliente WebSocket desconectado')
      clients.delete(socket)
      console.log(`👥 Clientes conectados: ${clients.size}`)
    })

    socket.on('error', (error: any) => {
      console.error('⚠️ Erro no WebSocket do servidor:', error)
      clients.delete(socket)
    })
  })
})


// Registro do plugin de multipart para uploads
// Importante: deve ser registrado antes de rotas que usam multipart
app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  }
})

// Registro do plugin de arquivos estáticos
// Importante: deve ser registrado antes de rotas que usam arquivos estáticos
app.register(fastifyStatic, {
  root: uploadsDir,
  prefix: "/uploads/"
})

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'secret',
  cookie: {
    cookieName: 'token',
    signed: false
  }
})

app.register(fastifyCookie)

// 5. Outras rotas por último
app.register(appRoutes)

// Hook para debug
app.addHook('onRequest', async (request, reply) => {
  if (request.url.includes('/uploads/')) {
    const filename = path.basename(request.url)
    const filePath = path.join(uploadsDir, filename)
    const exists = fs.existsSync(filePath)
    
    console.log(`🖼️  GET ${request.url}`)
    console.log(`📁 Procurando: ${filePath}`)
    console.log(`${exists ? '✅' : '❌'} Arquivo ${exists ? 'encontrado' : 'NÃO encontrado'}`)
    
    if (!exists) {
      const allFiles = fs.readdirSync(uploadsDir)
      console.log(`📋 Arquivos disponíveis: ${allFiles.join(', ')}`)
    }
  }
})
