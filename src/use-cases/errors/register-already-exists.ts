export class RegisterAlreadyExistsError extends Error {
  constructor() {
    super('Registro já existente')
  }
}
