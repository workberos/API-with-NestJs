
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Post {

  //Option(primary key): Tự động tạo giá trị của trường này mà không cần phải nhập
  @PrimaryGeneratedColumn()

  //Option(primary key): Tự chỉ định giá trị của trường này
  // @PrimaryColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;
}

export default Post;