import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import CreatePostDto from './dto/createPost.dto';
import Post from './post.entity';
import UpdatePostDto from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostNotPoundException } from './exception/postNotFund.exception';


@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(Post)
    public postsRepository: Repository<Post>

  ) { }

  async getAllPosts() {
    const res = await this.postsRepository.find()
    if(res.length){
      return res
    }
    return 'Data is empty'
  }

  async getPostById(id: number) {
    const filterCondition = {where: {id}}
    const post = await this.postsRepository.findOne(filterCondition);
    
    if (post) return post;
    throw new NotFoundException();
  }


  async createPost(post: CreatePostDto) {
  const newPost = await this.postsRepository.create(post);
  // console.log('post===',post)
  // console.log('newPost===',newPost)

  await this.postsRepository.save(post);
  // await this.postsRepository.save(newPost);

  return post;
  }

  async updatePost(id: number, post: UpdatePostDto) {
    // Cập nhật trước, nhưng không check xem entity có tồn tại trong db không
    await this.postsRepository.update(id, post); 
    
    // Tương tự mệnh đề where trong sql
    const filterCondition = {where: {id}}

    const updatedPost = await this.postsRepository.findOne(filterCondition);
    if (updatedPost) {
      return updatedPost
    }
    throw new HttpException(`Post at index ${id} not found`, HttpStatus.NOT_FOUND);
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    


    console.log(deleteResponse.raw)
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
  

  async deleteAll(){
    this.postsRepository.clear();
    return 'Data is empty';
  }


  
}
