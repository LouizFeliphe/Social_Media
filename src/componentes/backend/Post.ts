import { supabase } from "../../supabase";
import type { Comentario } from "../Comentario/interface";
import type { PostInput } from "../Post/interface";

export const CriarPostBackend = async (post: PostInput, imageFile: File | null) => {

    if(imageFile){
    const filePath = `${post.titulo}-${Date.now()}-${imageFile.name}`

    const { error: uploadError } = await supabase.storage.from("post-images").upload(filePath, imageFile)

    if (uploadError) throw new Error(uploadError.message)

    const { data: publicUrlData } = supabase.storage.from("post-images").getPublicUrl(filePath)

    const { data, error } = await supabase.from("posts").insert({ ...post, image_url: publicUrlData.publicUrl})
    if (error) throw new Error(error.message)

        return data
    }

    else{

        const { data, error } = await supabase.from("posts").insert({ ...post, image_url: null})
        if (error) throw new Error(error.message)

        return data
    }

}

export const EnviarComentario = async ({post_id, conteudo, user_id, author, pai_comentario_id, avatar_url}: Comentario): Promise<void> =>{

    if(!user_id || !author) {
        console.log(user_id, author);
        
        throw new Error("Usuario nao autenticado")}

    const { error } = await supabase.from("comentarios").insert({
        post_id,
        conteudo,
        user_id,
        author, 
        pai_comentario_id,
        avatar_url
    })

    if( error ) throw new Error("Aconteceu um erro ao enviar")
}

export const Vote = async (likeValue: number, postId: number, userId: string) => {
  const { data: existingLike } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingLike) {
    // Liked -> 0, Like -> -1
    if (existingLike.vote === likeValue) {
      console.log("entrou");
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("id", existingLike.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("likes")
        .update({ vote: likeValue })
        .eq("id", existingLike.id);

      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: userId, vote: likeValue });
    if (error) throw new Error(error.message);
  }
};

export const EditarComentario = async (comentarioEditado: string, idComentario: number) => {

   const { error } = await supabase
        .from("comentarios")
        .update({ conteudo: comentarioEditado })
        .eq("id", idComentario);

  if (error) throw new Error(error.message);
}