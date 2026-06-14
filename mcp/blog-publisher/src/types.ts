export type LoginResponse = {
  data?: {
    id: number;
    name: string;
    role: string;
    token: string;
  };
};

export type ArticlePayload = {
  title: string;
  content: string;
  cover_image?: string;
  stage?: string;
  vol?: number;
  tags?: string[];
};

export type Article = {
  id: number;
  title: string;
  content: string;
  stage: string;
  vol: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  author_id: number;
  author?: {
    id: number;
    name: string;
    role: string;
  };
};

export type UploadImageResponse = {
  data: {
    url: string;
    name: string;
    size: number;
  };
};
