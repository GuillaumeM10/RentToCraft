import { UserDto } from "./user";
import { FileDto } from "./file";

export class PostDto {
  id: number | null;
  title: string;
  slug: string;
  content: string;
  published: boolean;

  author: UserDto;
  thumbnail: FileDto;
  comments: PostCommentDto[];
  cats: PostCatDto[];
}

export class PostCatDto {
  id: number | null;
  name: string;
  slug: string;

  posts: PostDto[] | null;
}

export class PostCommentDto {
  id: number | null;
  content: string;

  author: UserDto;
  post: PostDto;
  replyTo?: PostCommentDto | null;
}
