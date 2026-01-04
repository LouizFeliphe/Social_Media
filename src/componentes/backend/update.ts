import { supabase } from "../../supabase";

export const EditarComentario = async (comentarioEditado: string, idComentario: number) => {

   const { error } = await supabase
        .from("comentarios")
        .update({ conteudo: comentarioEditado })
        .eq("id", idComentario);

  if (error) throw new Error(error.message);
}