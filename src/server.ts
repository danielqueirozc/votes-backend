import { app } from "./app";

const start = async () => {
  try {
    await app.listen({
      host: '0.0.0.0',
      port: 4000,
    })
    
    console.log('🚀 HTTP server running on http://localhost:4000')
    console.log('🔌 WebSocket disponível em ws://localhost:4000/ws')
    console.log('📡 Servidor pronto para receber conexões')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()