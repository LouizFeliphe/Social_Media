import { supabase } from "../../supabase"


export const DeletarComentario = async (comentarioId: number): Promise<void> =>{
    
    const { error } = await supabase.from("comentarios").delete().eq("id", comentarioId);

    if(error) throw new Error("Não foi possivel deletar o comentario")

}