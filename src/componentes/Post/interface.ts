export interface Props {
  postId: number;
  isHome: boolean
}

export interface PostInput {
    titulo: string,
    conteudo: string,
    user_id: string
}

export interface Post{
    id: number,
    titulo: string,
    conteudo: string,
    created_at: string,
    image_url: string,
    user_id: string,
    profile: {
        avatar_url: string,
        name: string,
        email: string,
    }
}


