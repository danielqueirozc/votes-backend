import { Prisma } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { prisma } from "../../lib/prisma.js";

// PrismaUsersRepository
export class PrismaUsersRepository implements UsersRepository {
    async create(data: Prisma.UserCreateInput) {
        const user = await prisma.user.create({ data })
        return user
    }

    async findByEmail(email: string) {
        console.log('🔎 Repository: Buscando email no banco:', email) // 👈 ADICIONE
        
        const user = await prisma.user.findUnique({ where: { email } })
        
        console.log('🔎 Repository: Resultado da busca:', user) // 👈 ADICIONE
        
        return user
    }

    async findById(id: string) {
        const user = await prisma.user.findUnique({ where: { id } })
        return user
    }   
}