// src/http/controller/upload-image.ts
import type { FastifyReply, FastifyRequest } from "fastify"
import path from "path"
import fs from "fs"
import { randomUUID } from "crypto"
import { pipeline } from "stream/promises"

const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp"])
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function uploadImage(request: FastifyRequest, reply: FastifyReply) {
  try {
    const file = await request.file()
    
    if (!file) {
      return reply.status(400).send({ message: "Nenhum arquivo enviado" })
    }

    console.log("📤 Recebido arquivo:", {
      filename: file.filename,
      mimetype: file.mimetype,
      encoding: file.encoding
    })

    // Validações
    if (!file.mimetype.startsWith("image/")) {
      return reply.status(400).send({ message: "O arquivo precisa ser uma imagem" })
    }

    const ext = path.extname(file.filename).toLowerCase()
    if (!ALLOWED_EXT.has(ext)) {
      return reply.status(400).send({ message: "Extensão de imagem não permitida" })
    }

    // 🎯 MESMO CAMINHO do servidor principal
    const uploadsDir = path.resolve(process.cwd(), "uploads")
    
    // Garante que existe
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
      console.log("📁 Pasta uploads criada no controller:", uploadsDir)
    }

    const filename = `${randomUUID()}${ext}`
    const destPath = path.join(uploadsDir, filename)

    console.log("💾 Salvando em:", destPath)

    // Salva o arquivo
    await pipeline(file.file, fs.createWriteStream(destPath))

    // Verifica se foi salvo
    const savedSuccessfully = fs.existsSync(destPath)
    const fileStats = savedSuccessfully ? fs.statSync(destPath) : null

    console.log("📊 Status do arquivo:")
    console.log("  - Salvo:", savedSuccessfully ? "✅ SIM" : "❌ NÃO")
    if (fileStats) {
      console.log("  - Tamanho:", fileStats.size, "bytes")
    }

    if (!savedSuccessfully) {
      return reply.status(500).send({ message: "Erro ao salvar arquivo" })
    }

    const baseUrl = process.env.APP_URL ?? "http://localhost:4000"
    const publicUrl = `${baseUrl}/uploads/${filename}`

    console.log("🌐 URL pública:", publicUrl)

    return reply.status(201).send({ 
      url: publicUrl,
      filename: filename,
      size: fileStats?.size || 0
    })

  } catch (error) {
    console.error("❌ Erro no upload:", error)
    return reply.status(500).send({ message: "Erro interno do servidor" })
  }
}