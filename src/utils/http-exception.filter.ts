import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    console.log(` httpExeption throw error`)
    // response.send()
    response
      .status(status)
      .json({
        message,
        statusCode: status,
        time: new Date().toISOString(),
      });
  }
}