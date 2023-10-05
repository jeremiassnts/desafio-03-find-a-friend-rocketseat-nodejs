export class UserHasOrganizationError extends Error {
    constructor() {
        super('Já existe uma organização associada a esse usuário')
    }
}