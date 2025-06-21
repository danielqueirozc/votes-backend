import { User } from "@prisma/client";
import { UsersRepository } from "../repositories/users-repository";
import { compare } from "bcryptjs";
import { TokenProvider } from "../@types/token-provider";

interface AuthenticateServiceRequest {
    email: string;
    password: string;
}

interface AuthenticateServiceResponse {
    user: User;
    token: string
}

export class AuthenticateService {
    constructor(
        private usersRepository: UsersRepository,
        private tokenProvider: TokenProvider
    ) {}

    async execute({ email, password }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
        const user = await this.usersRepository.findByEmail(email)

        if (!user) {
            throw new Error('Invalid credentials.')
        }

        const doesPasswordMatches = await compare(password, user.password_hash)

        if (!doesPasswordMatches) {
            throw new Error('Invalid credentials.')
        }

        const token = await this.tokenProvider.sign({ sub:user.id })

        return {
            user,
            token
        }
    }
}