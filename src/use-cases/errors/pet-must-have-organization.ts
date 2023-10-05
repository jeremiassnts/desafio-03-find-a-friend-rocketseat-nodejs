export class PetMustHaveOrganizationError extends Error {
    constructor() {
        super('Pet precisa estar associado a uma organização')
    }
}