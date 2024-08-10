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
  thumbnail: string;
  thumbnailFile: string;
  heroDescription: string;
  featured: boolean;
}

interface IntegrationData {
  siteId: string;
  type: string;
  apiKey?: string;
  audienceId?: string;
  audienceId?: string;
  webhookUrl?: string;
  active: boolean;
  postWebhookUrl?: string;
  postWebhookActive?: boolean;
  plunkKey?: string;
}

interface AddIntegrationData {
  firstName: string;
  lastName: string;
  email: string;
  source?: string;
  sourceTitle?: string;
  websiteUrl?: string;
}

interface SubscribeData {
  siteId: string;
  email: string;
}
interface SubscribeData {
  siteId: string;
  email: string;
}

interface SubscribeReponse {
  success: boolean;
  message: string;
}

interface RgbaColorType {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface SlideStyle {
  id: number;
  textColor: string;
  bgColor: string;
  bgImage: string;
  content?: string;
}

interface gateSlide {
  id: number;
  type: string;
  link?: string;
}

interface leadSlide extends gateSlide {
  name: string;
  leadId: string;
  ctaBtnText: string | null | undefined;
}
interface PlunkContact {
  id: string;
  email: string;
  subscribed: boolean;
  data: string;
  createdAt: string;
  updatedAt: string;
}
