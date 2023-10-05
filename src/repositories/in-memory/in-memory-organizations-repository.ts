import { Organization, Prisma } from "@prisma/client";
import { OrganizationsRepository } from "../organizations-repository";
import { randomUUID } from "crypto";

export class InMemoryOrganizationsRepository implements OrganizationsRepository {
    public organizations: Organization[] = []
    async create({ owner, email, CEP, address, password_hash, whatsapp }: Prisma.OrganizationCreateInput): Promise<Organization> {
        const newOrg = {
            id: randomUUID(),
            address,
            CEP,
            email,
            owner,
            password_hash,
            whatsapp
        }
        this.organizations.push(newOrg)

        return newOrg
    }

    async findByEmail(email: string) {
        let org = this.organizations.find(e => e.email === email)
        if (!org) return null

        return org
    }

    async findByWhatsapp(whatsapp: string) {
        let org = this.organizations.find(e => e.whatsapp === whatsapp)
        if (!org) return null

        return org
    }
}