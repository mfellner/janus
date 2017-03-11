export const NOT_FOUND = 'NOT_FOUND'
export const DUPLICATE_ENTRY = 'DUPLICATE_ENTRY'

export class NotFoundError extends Error {
  readonly code: 'NOT_FOUND'

  constructor(message: string) {
    super(message)
    this.code = NOT_FOUND
  }
}

export class DuplicateEntryError extends Error {
  readonly code: 'DUPLICATE_ENTRY'

  constructor(message: string) {
    super(message)
    this.code = DUPLICATE_ENTRY
  }
}

export type RepositoryError = NotFoundError | DuplicateEntryError
