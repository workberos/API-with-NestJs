import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "./user.entity";
import { UserService } from "./users.service";

@Module({
  // forFeature() xác định repo nào được đăng kí trong module
  imports: [TypeOrmModule.forFeature([User])],
  providers:[UserService],
  exports:[UserService]
})

export default class UserModule{};