import { supabase } from "../../supabase"
import type { Comentario } from "../Comentario/interface"
import type { Like, LikePerfil } from "../Likes/interface"
import type { Chats } from "../mensagem/interface"
import type { Perfil } from "../Perfil/interface"
import type { Post } from "../Post/interface"

export const ReceberComentarios = async (postId: number) : Promise<Comentario[]> => {

    const {data, error} = await supabase.from("comentarios").select(`id,created_at,post_id,conteudo,user_id,pai_comentario_id, profile!inner (
      name,
      email,
      avatar_url
    )`).eq("post_id", postId).order("created_at", {ascending: false})

    if(error) throw new Error("Aconteceu um erro no fetch")
        
    return data as unknown as Comentario[]
    
}

export const FetchPerfil = async (userId: string): Promise<Perfil> =>{
  const {data, error} = await supabase
  .from("profile")
  .select("*")
  .eq("user_id",userId.toString()).single()

  if(error) throw new Error(error.message)
  
  return data as Perfil
}

export const FetchPerfilPosts = async (userId: string): Promise<Post[]>=>{
  
  const {data, error} = await supabase
  .from("posts")
  .select(`id,conteudo,created_at,titulo,image_url, user_id, profile!inner (
      name,
      email,
      avatar_url
    )`)
  .eq("user_id",userId.toString())

  if(error) throw new Error(error.message)

  return data as unknown as Post[]
}

export const FetchVotes = async (postId: number): Promise<Like[]> => {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);
  return data as Like[];
};

export const fecthVotesPerfil =  async (user_id: string): Promise<LikePerfil[]> => {

  const { data, error } = await supabase
    .from("likes")
    .select(`vote,posts (
      id,created_at,titulo,conteudo,image_url,user_id, profile!inner (
      name,
      email,
      avatar_url)
    )`)
    .eq("user_id", user_id);

  
  if (error) throw new Error(error.message);
  return data as unknown as LikePerfil[];
};

export const FetchPosts = async (): Promise<Post[]> =>{
    const {data,error} = await supabase.from("posts").select(`id,conteudo,created_at,titulo,image_url, user_id, profile!inner (
      name,
      email,
      avatar_url
    )`).order("created_at",{ascending: false})

    if (error) throw new Error(error.message)
    

    return data as unknown as Post[]
}

export const FetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`id,conteudo,created_at,titulo,image_url, user_id, profile!inner (
      name,
      email,
      avatar_url
    )`)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as unknown as Post;
};


const apikey = import.meta.env.VITE_TENORKEY as string
const clientkey = "SocialApp"
const lmt = 12

export const fetchGifs = async (term: string) => {
      
      const search_url =
        `https://tenor.googleapis.com/v2/search?q=${term}` +
        `&key=${apikey}&client_key=${clientkey}&limit=${lmt}&locale=pt_BR`

      const res = await fetch(search_url)

      if(!res.ok){
        throw new Error("Erro: " + res.status)
      }

      const data = await res.json()

      return data.results || [] 
}

export const fetchCategories = async () => {
   
      const cat_url =
        `https://tenor.googleapis.com/v2/categories?key=${apikey}&client_key=${clientkey}&locale=pt_BR`

      const res = await fetch(cat_url)

      if(!res.ok){
        throw new Error("Erro: " + res.status)
      }

      const data = await res.json()
  
      return data.tags || []
}


export const isUsuarioSegue = async (userId: string, profileId: string):Promise<boolean> => {

  const {data,error} = await supabase
  .from("follows")
  .select("id")
  .eq("follower_id", userId)
  .eq("following_id", profileId)
  .maybeSingle();


  if (error) throw new Error(error.message);

  return !!data

}

export async function contarSeguidores(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", userId);

  if (error) throw error;
  return count ?? 0;
}

export async function contarSeguindo(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);

  if (error) throw error;
  return count ?? 0;
}

export const pegarChatsUsuario = async (userId: string):Promise<Chats[]> =>{

  const { data, error } = await supabase
  .from("conversation_participants")
  .select(`
    conversation_id,
    conversations (
      id,
      title,
      is_group,
      conversation_last_message (
        content,
        sender_id,
        created_at
      ),
      conversation_participants (
        user_id,
        profile (
          name,
          avatar_url
        )
      )
    )
  `)
  .eq("user_id", userId);

  if (error) throw error;

  return data as unknown as Chats[]

}

export const pegarMensagensChat = async (chatId: string) =>{
 
const { data: perfils, error: error1 } = await supabase
    .from("conversation_participants")
    .select(`
      profile (
        email,
        user_id,
        name,
        avatar_url
      )
    `)
    .eq("conversation_id", chatId);

  if (error1) throw new Error("Erro ao buscar perfis");

  const { data: mensagens, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", chatId);

  if (error) throw new Error("Erro ao buscar mensagens");

  return {
      perfils,      
      mensagens }
  ;
}