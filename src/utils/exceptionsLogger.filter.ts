import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
// Extending the BaseExceptionFilter
@Catch()
export class ExceptionLoggerFilter extends BaseExceptionFilter{
  catch(exception: unknown, host: ArgumentsHost): void {
    console.log('Exception thrown', exception);
    super.catch(exception, host)
  }
}