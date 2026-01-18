export interface Perfil {
    user_id: string,
    created_at: string,
    name: string,
    avatar_url: string | null,
    email: string,
    about: string | null,
    location: string | null, 
}