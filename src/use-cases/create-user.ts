import { hash } from 'bcryptjs'
import { ROLES } from "@prisma/client";
import { UsersRepository } from "@/repositories/users-repository";
import { RegisterAlreadyExistsError } from "./errors/register-already-exists";

interface CreateUserUseCaseRequest {
    name: string
    email: string
    password: string
    role: ROLES
}
export class CreateUserUseCase {
    constructor(private usersRepository: UsersRepository) { }
    async execute({ name, email, password, role = 'COMMON' }: CreateUserUseCaseRequest) {
        let user = await this.usersRepository.findByEmail(email)
        if (user) {
            throw new RegisterAlreadyExistsError()
        }

        const password_hash = await hash(password, 6)
        user = await this.usersRepository.create({ email, name, password_hash, role })

        return {
            user
        }
    }
}