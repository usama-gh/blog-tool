import { Post } from "@prisma/client";

declare global {
  var Paddle: any;
}

interface Collector {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  post: Post;
}
