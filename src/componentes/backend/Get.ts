import { supabase } from "../../supabase"
import type { Comentario } from "../Comentario/interface"
import type { Like, Post } from "../Post/interface"

export const ReceberComentarios = async (postId: number) : Promise<Comentario[]> => {

    const {data, error} = await supabase.from("comentarios").select("*").eq("post_id", postId).order("created_at", {ascending: false})

    if(error) throw new Error("Aconteceu um erro no fetch")
        
    return data as Comentario[]
    
}

export const FetchVotes = async (postId: number): Promise<Like[]> => {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);
  return data as Like[];
};

export const FetchPosts = async (): Promise<Post[]> =>{
    const {data,error} = await supabase.from("posts").select("*").order("created_at",{ascending: false})

    if (error) throw new Error(error.message)
    

    return data
}

export const FetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};