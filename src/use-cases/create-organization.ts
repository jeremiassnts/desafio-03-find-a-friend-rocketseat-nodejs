import { OrganizationsRepository } from '@/repositories/organizations-repository'
import { RegisterAlreadyExistsError } from './errors/register-already-exists'
import { UserHasOrganizationError } from './errors/user-has-organization'
import { Organization } from '@prisma/client'
import { OrganizationMustBeCompleteError } from './errors/organization-must-be-complete'
import { getAddressByCEP } from '@/utils/get-address-by-cep'

interface CreateOrganizationUseCaseRequest {
  owner: string
  CEP: string
  whatsapp: string
  userId: string
}
interface CreateOrganizationUseCaseResponse {
  org: Organization
}
export class CreateOrganizationUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}
  async execute({
    owner,
    CEP,
    whatsapp,
    userId,
  }: CreateOrganizationUseCaseRequest): Promise<CreateOrganizationUseCaseResponse> {
    if (!CEP || !whatsapp) {
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

    const addressData = await getAddressByCEP(CEP)

    org = await this.organizationsRepository.create({
      CEP,
      owner,
      whatsapp,
      userId,
      ...addressData,
    })
    return {
      org,
    }
  }
}
