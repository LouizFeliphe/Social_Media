export interface Chat{
    conversation_id: string
    conversations: {
        conversation_last_message: Mensagem[],
        conversation_participants: {
            user_id: string
            profile:{
                name: string,
                avatar_url: string
            }
        }[]
        is_group: boolean,
        title: string | null,
    }
}

export interface Mensagem{
    content: string,
    conversation_id: string,
    created_at: string,
    id: string,
    sender_id: string,
}

export interface Perfil_Mensagem{
    perfils:{
        profile: {
            name: string,
            email: string,
            user_id: string,
            avatar_url: string
        }
    }[],
    mensagens: Mensagem[],
}