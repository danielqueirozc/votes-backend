import { User } from "@prisma/client"
import { UsersRepository } from "../repositories/users-repository"
import { hash } from "bcryptjs"

interface RegisterServiceRequest {
    name: string
    email: string
    password: string
}

interface RegisterServiceResponse {
    user: User
}

export class RegisterService {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ name, email, password }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if (userWithSameEmail) {
            throw new Error('User already exists.')
        }

        const password_hash = await hash(password, 7)

        const user = await this.usersRepository.create({ name, email, password_hash })

        return {
            user,
        }
    }
}