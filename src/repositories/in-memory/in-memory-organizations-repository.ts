import { Organization, Prisma } from "@prisma/client";
import { OrganizationsRepository } from "../organizations-repository";
import { randomUUID } from "crypto";
import { GetResult } from "@prisma/client/runtime/library";

export class InMemoryOrganizationsRepository implements OrganizationsRepository {
    public organizations: Organization[] = []
    async create({ owner, CEP, address, whatsapp, userId, city, neighborhood, state }: Prisma.OrganizationUncheckedCreateInput): Promise<Organization> {
        const newOrg = {
            id: randomUUID(),
            address,
            CEP,
            owner,
            whatsapp,
            userId,
            city,
            neighborhood,
            state
        }
        this.organizations.push(newOrg)

        return newOrg
    }

    async findByWhatsapp(whatsapp: string) {
        let org = this.organizations.find(e => e.whatsapp === whatsapp)
        if (!org) return null

        return org
    }

    async findByUserId(userId: string) {
        let org = this.organizations.find(e => e.userId === userId)
        if (!org) return null

        return org
    }

    async getManyByCity(city: string, state: string) {
        const orgs = this.organizations.filter(org => org.city?.toUpperCase() === city.toUpperCase() && org.state?.toUpperCase() === state.toUpperCase())
        return orgs
    }
}