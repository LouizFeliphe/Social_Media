import { supabase } from "../../supabase";
import type { Comentario } from "../Comentario/interface";
import type { PostInput } from "../Post/interface";

export const CriarPostBackend = async (post: PostInput, imageFile: File | null ) => {

    if(imageFile){
    
    const extensao = imageFile.name.split(".").pop()

    const filePath = `${crypto.randomUUID()}.${extensao}`

    const { error: uploadError } = await supabase.storage.from("post-images").upload(filePath, imageFile,
    {contentType: imageFile.type })

    if (uploadError) throw new Error(uploadError.message)

    const { data: publicUrlData} = supabase.storage.from("post-images").getPublicUrl(filePath)

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
    if (existingLike.vote === likeValue) {
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

export const ConversorGifToFile = async (url: string, filename: string) => {
  
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Erro ao baixar o GIF')
  }

  const blob = await response.blob()

  return new File([blob], filename, {
    type: blob.type || 'image/gif',
  })
}

export const PerfilPost = async (
  userId: string,
  nome: string,
  backgroundImage: File | null,
  profileImage: File | null,
  about: string | null,
  localizacao: string | null
) => {
   
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {
    name: nome,
    about,
    location: localizacao,
  };

  if (backgroundImage) {
    const backgroundPath = `backgrounds/${userId}-${Date.now()}.${backgroundImage.name.split(".").pop()}`;

    const { error: bgError } = await supabase.storage
      .from("post-images")
      .upload(backgroundPath, backgroundImage, {
        contentType: backgroundImage.type,
      });

    if (bgError) {
     console.error("Erro upload background:", bgError);
    throw bgError;
     }

    const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(backgroundPath);

    updateData.background = data.publicUrl;
  }

  
  if (profileImage) {
    const avatarPath = `avatars/${userId}-${Date.now()}.${profileImage.name.split(".").pop()}`;

    const { error: avatarError } = await supabase.storage
      .from("post-images")
      .upload(avatarPath, profileImage, {
        contentType: profileImage.type,
      });

    if (avatarError) throw avatarError;

    const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(avatarPath);

    updateData.avatar_url = data.publicUrl;
  }

 
  const { error } = await supabase
    .from("profile")
    .update(updateData)
    .eq("user_id", userId);

  if (error) throw error;
};
