// Custom exeption NotFoundException

import { NotFoundException } from "@nestjs/common";

// Option 1:
// import { HttpException, HttpStatus } from "@nestjs/common";

// class PostNotPoundException extends HttpException{
//   constructor(postId: number){
//     super(`Post with id ${postId} not found`, HttpStatus.NOT_FOUND)
//   }
// }

// Option 2:
export class PostNotPoundException extends NotFoundException{
  constructor(postId: number){
    super(`Post with id ${postId} not found`)
  }
}