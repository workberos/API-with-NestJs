import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import PostsService from './posts.service';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';

@Controller('posts')
export default class PostsController {
  constructor(
    private readonly postsService: PostsService
  ) {}

  @Get()
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  // Yêu cầu xác thực người dùng khi gọi phương thức
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post);
  }

  @Patch(':id')
  async updatePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(Number(id));
  }

  @Delete()
  async deleteAll(){
    return await this.postsService.deleteAll();
  }


}
