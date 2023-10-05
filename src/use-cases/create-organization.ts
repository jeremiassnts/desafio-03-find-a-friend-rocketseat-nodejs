import { OrganizationsRepository } from "@/repositories/organizations-repository";
import { hash } from 'bcryptjs'
import { OrganizationAlreadyExistsError } from "./errors/organization-already-exists";

interface CreateOrganizationUseCaseRequest {
    owner: string
    email: string
    CEP: string
    address: string
    whatsapp: string
    password: string
}
export class CreateOrganizationUseCase {
    constructor(private organizationsRepository: OrganizationsRepository) { }
    async execute({ owner, email, CEP, address, whatsapp, password }: CreateOrganizationUseCaseRequest) {
        let org = await this.organizationsRepository.findByEmail(email)
        if (org) {
            throw new OrganizationAlreadyExistsError()
        }

        org = await this.organizationsRepository.findByWhatsapp(whatsapp)
        if (org) {
            throw new OrganizationAlreadyExistsError()
        }

        const password_hash = await hash(password, 6)
        org = await this.organizationsRepository.create({ address, CEP, email, owner, password_hash, whatsapp })

        return {
            org
        }
    }
}