import { beforeEach, describe, expect, it } from "vitest";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { RegisterService } from "./register";

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterService(usersRepository)
    })

    it('should be able to register', async () => {
       

        const { user } = await sut.execute({
            name: 'John Doe',
            email: '8B0lT@example.com',
            password: '123456'  
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
       const { user } = await sut.execute({
            name: 'John Doe',
            email: '8B0lT@example.com',
            password: '123456'  
       })

       const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

       expect(isPasswordCorrectlyHashed).toBe(true)
    })
})