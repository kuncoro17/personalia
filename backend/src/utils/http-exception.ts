// utils/http-exceptions.ts
export class HttpException extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = new.target.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ✅ 400 Bad Request
export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}

// ✅ 401 Unauthorized
export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

// ✅ 403 Forbidden
export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

// ✅ 404 Not Found
export class NotFoundException extends HttpException {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

// ✅ 405 Method Not Allowed
export class MethodNotAllowedException extends HttpException {
  constructor(message = 'Method Not Allowed') {
    super(405, message);
  }
}

// ✅ 429 Too Many Requests
export class TooManyRequestsException extends HttpException {
  constructor(message = 'Too Many Requests') {
    super(429, message);
  }
}

// ✅ 500 Internal Server Error
export class InternalServerErrorException extends HttpException {
  constructor(message = 'Internal Server Error') {
    super(500, message);
  }
}

// ✅ 502 Bad Gateway
export class BadGatewayException extends HttpException {
  constructor(message = 'Bad Gateway') {
    super(502, message);
  }
}

// ✅ 504 Gateway Timeout
export class GatewayTimeoutException extends HttpException {
  constructor(message = 'Gateway Timeout') {
    super(504, message);
  }
}
