import { Organization, Prisma } from "@prisma/client";

export interface OrganizationsRepository {
    create(data: Prisma.OrganizationUncheckedCreateInput): Promise<Organization>
    findByWhatsapp(whatsapp: string): Promise<Organization | null>
    findByUserId(userId: string): Promise<Organization | null>
    getManyByCity(city: string, state: string): Promise<Organization[]>
}