import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { AuthenticateService } from "./authenticate";
import { TokenProvider } from "../@types/token-provider";


class FakeTokenProvider implements TokenProvider {
    sign(payload: object): string {
        return 'fake-token'
    }
}

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService
let tokenProvider: FakeTokenProvider

describe('Authenticate Service', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        tokenProvider = new FakeTokenProvider()
        sut = new AuthenticateService(usersRepository, tokenProvider)
    })

    it('should be able to authenticate', async () => {
       
        await usersRepository.create({
            name: 'John Doe',
            email: '8B0lT@example.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            email: '8B0lT@example.com',
            password: '123456'  
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () => {

        await expect(() => 
            sut.execute({
                email: '8B0lT@example.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(Error)
        
    })

    it('should not be able to authenticate with wrong password', async () => {

          await usersRepository.create({
            name: 'John Doe',
            email: '8B0lT@example.com',
            password_hash: await hash('123456', 6)
        })

        await expect(() => 
            sut.execute({
                email: '8B0lT@example.com',
                password: '123'
            })
        ).rejects.toBeInstanceOf(Error)
        
    })
})