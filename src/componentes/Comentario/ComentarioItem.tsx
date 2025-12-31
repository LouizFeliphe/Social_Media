import { useState } from "react";
import { useAuth } from "../../contexto/auth/useAuth";
import type { ComentarioItemType } from "./interface";

const ComentarioItem = ({ postId, comentario }: ComentarioItemType) => {
    
    const [mostrarRespostas, setMostrarRespostas] = useState<boolean>(false)

    const { usuario } = useAuth()

    return (
        <div>
            <div>
                <div>
                    <span>{comentario.author}</span>
                    <span>{new Date(comentario.created_at!).toLocaleString()}</span>
                </div>
                <p>{comentario.conteudo}</p>
                <button onClick={() => setMostrarRespostas((prev) => !prev)}>{mostrarRespostas ? "Mostrar+" : "Esconder"}</button>
            </div>
            {mostrarRespostas && comentario.children!.length > 0 && comentario.children?.map((child,key)=> <ComentarioItem comentario={child} key={key} postId={postId}/>)}
        </div>
    )
}

export default ComentarioItem;