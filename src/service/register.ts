import { User } from "@prisma/client"
import { UsersRepository } from "../repositories/users-repository"

interface RegisterServiceRequest {
    name: string
    email: string
    password: string
}

interface RegisterServiceResponse {
    user: User
}

export class RegisterService {
    constructor(private usersRepository: UsersRepository)

    execute({ name, email, password }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
        
    }
}