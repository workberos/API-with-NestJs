import { AuthenticationService } from "./authentication.service";
import { LocalAuthenticationGuard } from "./localAuthentication.guard";
import RequestWithUser from "./requestWithUser.interface";
import JwtAuthenticationGuard from "./jwt-authentication.guard";
import RegisterDto from "./dto/register.dto";
import { Response } from "express";
import { 
  Body, 
  Controller, 
  HttpCode, 
  Post, 
  Req, 
  UseGuards, 
  Res, 
  Get, 
  UnauthorizedException 
} from "@nestjs/common";


@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ){} 

  // Đăng kí user
  @Post('register')
  async register(@Body() registrationData:RegisterDto){
    return this.authenticationService.register(registrationData)
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard) //Cần xác thực thông tin email, password trước khi login
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const user = request.user;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    console.log( 'authController login')
    return response.send(user)
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Res() response: Response) {
    console.log('log-out')
    // Gỡ cookie ra
    response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get() 
  authenticate(@Req() request:RequestWithUser){
    if(request.user){
      const user = request.user;
      user.password = undefined;
      console.log(user)
      return user
    }
    throw new UnauthorizedException();
  }
}
