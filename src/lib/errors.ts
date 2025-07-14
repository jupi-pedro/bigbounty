export class BadRequestError extends Error {
  status = 400
  constructor(message = "Bad Request") {
    super(message)
  }
}

export class UnauthorizedError extends Error {
  status = 401
  constructor(message = "Unauthorized") {
    super(message)
  }
}

export class ForbiddenError extends Error {
  status = 403
  constructor(message = "Forbidden") {
    super(message)
  }
}
