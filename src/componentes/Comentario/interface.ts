
export interface Props{
    postId: number,
}

export interface Comentario {
    id?: number,
    post_id: number,
    conteudo: string,
    user_id: string | null,
    author: string | null,
    pai_comentario_id: number | null,
    created_at?: string,
    avatar_url?: string,
}

export type ComentarioArvore = (Comentario & {children?: Comentario[]})


export interface ComentarioItemType {
    postId: number,
    comentario: ComentarioArvore
}
