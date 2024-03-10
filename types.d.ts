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

interface LeadData {
  siteId: string;
  name: string;
  title: string;
  description: string;
  buttonCta: string;
  download: string;
  delivery: string;
  url: string;
  fileName: string;
}

interface SubscribeData {
  siteId: string;
  email: string;
}

interface SubscribeReponse {
  success: boolean;
  message: string;
}

interface SlideStyle {
  id: number;
  textColor: string;
  bgColor: string;
  bgImage: string;
  content: string;
}
