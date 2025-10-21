import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import fastifyMultipart from "@fastify/multipart";
import websocket from '@fastify/websocket'
import 'dotenv/config'
import path from "path";
import fs from "fs";

const uploadsDir = path.resolve(process.cwd(), "uploads")

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
} else {
  console.log("📁 Pasta uploads existe:", uploadsDir)
}

const existingFiles = fs.readdirSync(uploadsDir)
console.log("📁 Arquivos na pasta uploads:", existingFiles.length > 0 ? existingFiles : "pasta vazia")

export const app = fastify({ 
  logger: true,
  bodyLimit: 10 * 1024 * 1024,

  // configurações do WebSocket
  connectionTimeout: 0,
  keepAliveTimeout: 72000
})

const clients = new Set<any>()

// 1. CORS primeiro
app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
})

// 2. WebSocket com opções
app.register(websocket, {
  options: {
    maxPayload: 1048576, // 1MB
    clientTracking: true
  }
})

// 3. Outros plugins
app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  }
})

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

// 4. Rota WebSocket simplificada
app.register(async (fastifyInstance) => {
  fastifyInstance.get('/ws', { websocket: true }, (socket: any, request: any) => {
    console.log('✅ Cliente WebSocket conectado!')
    console.log('📍 IP:', request.socket.remoteAddress)

    clients.add(socket)

    // ✅ Enviar mensagem de boas-vindas APÓS adicionar aos clientes
    try {
      socket.send(JSON.stringify({
        event: 'connected',
        message: 'Conectado ao servidor WebSocket',
        timestamp: new Date().toISOString()
      }))
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem de boas-vindas:', error)
    }

    socket.on('message', (message: any) => {
      console.log('📨 Mensagem recebida do cliente:', message.toString())
      
      // Echo de volta para o cliente (teste)
      try {
        socket.send(JSON.stringify({
          event: 'echo',
          data: message.toString()
        }))
      } catch (error) {
        console.error('❌ Erro ao enviar echo:', error)
      }
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

// 5. Outras rotas por último
import { appRoutes } from "./http/routes/routes";
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

export function NotifyAllClients(data: unknown) {
  console.log(`📢 Notificando ${clients.size} clientes`)
  
  let successCount = 0
  let errorCount = 0
  
  for (const client of clients) {
    try {
      // readyState: 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED
      if (client.readyState === 1) {
        client.send(JSON.stringify(data))
        successCount++
      } else {
        console.log(`⚠️ Cliente em estado ${client.readyState}, removendo...`)
        clients.delete(client)
      }
    } catch (error) {
      console.error("❌ Erro ao enviar para cliente:", error)
      clients.delete(client)
      errorCount++
    }
  }
  
  console.log(`✅ Enviado para ${successCount} clientes, ${errorCount} erros`)
}