export interface Chats{
    conversation_id: string
    conversations: {
        conversation_last_message: unknown[],
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