import { OrganizationsRepository } from "@/repositories/organizations-repository";
import { RegisterAlreadyExistsError } from "./errors/register-already-exists";
import { UserHasOrganizationError } from "./errors/user-has-organization";
import { Organization } from "@prisma/client";
import { OrganizationMustBeCompleteError } from "./errors/organization-must-be-complete";

interface CreateOrganizationUseCaseRequest {
    owner: string
    CEP: string
    address: string
    whatsapp: string
    userId: string
}
interface CreateOrganizationUseCaseResponse {
    org: Organization
}
export class CreateOrganizationUseCase {
    constructor(private organizationsRepository: OrganizationsRepository) { }
    async execute({ owner, CEP, address, whatsapp, userId }: CreateOrganizationUseCaseRequest): Promise<CreateOrganizationUseCaseResponse> {
        if (!CEP || !address || !whatsapp) {
            throw new OrganizationMustBeCompleteError()
        }

        let org = await this.organizationsRepository.findByUserId(userId)
        if (org) {
            throw new UserHasOrganizationError()
        }

        org = await this.organizationsRepository.findByWhatsapp(whatsapp)
        if (org) {
            throw new RegisterAlreadyExistsError()
        }

        org = await this.organizationsRepository.create({ address, CEP, owner, whatsapp, userId })
        return {
            org
        }
    }
}