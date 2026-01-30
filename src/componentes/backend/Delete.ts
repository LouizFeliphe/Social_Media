import { supabase } from "../../supabase"


export const DeletarComentario = async (comentarioId: number): Promise<void> =>{
    
    const { error } = await supabase.from("comentarios").delete().eq("id", comentarioId);

    if(error) throw new Error("Não foi possivel deletar o comentario")

}

export const DeixarSeguir = async (userId: string, profileId: string) => {

  const {error} = await supabase
  .from("follows")
  .delete()
  .eq("follower_id", userId)
  .eq("following_id", profileId);


  if (error) throw new Error(error.message);

}