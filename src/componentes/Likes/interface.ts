export interface Like {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}

export interface LikePerfil {
  vote: number,
  posts: {
    conteudo: string,
    created_at: string,
    titulo: string,
    image_url: string,
    user_id: string,
    profile: {
        avatar_url: string,
        name: string,
        email: string,
    }
  }[]
}