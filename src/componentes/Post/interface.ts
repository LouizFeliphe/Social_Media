export interface Props {
  postId: number;
}

export interface PostInput {
    titulo: string,
    conteudo: string,
    avatar_url: string | null,
}

export interface Post{
    id: number,
    titulo: string,
    conteudo: string,
    created_at: string,
    image_url: string,
    avatar_url: string,
    nome: string,
    email: string,
}


