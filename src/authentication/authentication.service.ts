import { UserService } from "src/users/users.service";
import * as bcrypt from "bcrypt";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import RegisterDto from "./dto/register.dto";
import PostgresErrorCode from "src/database/postGresErrorCode.enum";
import User from "src/users/user.entity";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configservice: ConfigService
  ) { }

  /**
   * Đăng kí user
   * @param registrationData Thông tin User muốn đăng kí
   * @returns
   */
  public async register(registrationData: RegisterDto) {
    // Băm password ra thành một chuỗi khác
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      // Thêm user vào database với password đã băm
      const createdUser = await this.userService.createUser({
        ...registrationData,
        password: hashedPassword
      });
      // Reset password của user để không kèm theo password khi responce
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      // Nếu mã lỗi là 23505 thì throw lỗi email đã tồn tại
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        console.log(error)
        throw new HttpException('User with that email already exist', HttpStatus.BAD_REQUEST);
      }
      // Các lỗi khác
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  } 

  /**
   * Xác thực thông tin đăng nhập
   * @param email Email người dùng
   * @param plainTextPassword Password
   * @returns User (nếu xác thực thành công)
   */
  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      // Tìm User với email truyền vào
      const user = await this.userService.getByEmail(email);

      // So sánh email truyền đến và email được lưu trong database bằng phương thức verifyPassword
      await this.verifyPassword(plainTextPassword, user.password)
      // Ẩn password
      user.password = undefined;
      // Trả về User sau khi xác thực thành công
      console.log('getAuthUser userService')
      return user
    } catch (error) {
      throw new HttpException('Wrong credentials provided (getAuthenticatedUser)', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * So sánh password gửi đến và password đã lưu, sẽ báo lỗi nếu không trùng nhau
   * @param plainTextPassword Password gửi đến
   * @param hashedPassword Password đã hash được lưu trong db
   */
  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      // Nếu password không match sẽ throw error
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST)
    }
  }

  // Lấy cookie
  public getCookieWithJwtToken(userId: number) {
    
    const payload: TokenPayload = { userId};
    // Dùng payload tạo token
    const token = this.jwtService.sign(payload);
    // Trả về cookie
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configservice.get('JWT_EXPIRATION_TIME')}`
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/ Max-Age=0`
  }
}