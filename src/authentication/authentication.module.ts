import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import UserModule from "src/users/users.module";
import { AuthenticationService } from "./authentication.service";
import { LocalStrategy } from "./local.strategy";
import { AuthenticationController } from "./authentication.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";


@Module({
  imports:[UserModule, 
    PassportModule,
    ConfigModule,
    // config jwtMoudle để sử dụng jwtService trong AuthenticationService
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async (configService:ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn:`${configService.get('JWT_EXPIRATION_TIME')}s`
        },
      }),
    }),
  ],
  providers:[AuthenticationService, LocalStrategy, JwtStrategy],
  controllers:[AuthenticationController]
})
export class AuthenticationModule{}