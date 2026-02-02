
export interface Props{
    postId: number,
    isHome: boolean,
    nomePost?: string
}

export interface Comentario {
    id?: number,
    post_id: number,
    conteudo: string,
    user_id: string | null,
    pai_comentario_id: number | null,
    created_at?: string,
    profile?: {
        avatar_url: string,
        name: string,
        email: string,
    }
}

export type ComentarioArvore = (Comentario & {children?: Comentario[]})


export interface ComentarioItemType {
    postId: number,
    comentario: ComentarioArvore
}
