import { Svgs } from "../../assets/assets"
import type { Comentario } from "../Comentario/interface"

export const LikeBotaoHome = ({comentariosQuantidade,userComentario}:{
  comentariosQuantidade: number | undefined,
  userComentario: Comentario | undefined,
}) =>{

   return (<button className={`group px-5 py-2 rounded-lg 
          cursor-pointer active:scale-95 transition-all duration-300 bg-[#3d494f] hover:bg-[#333D42]
          `}>
          <p className="relative overflow-hidden">
            <span className="block transition-transform duration-300 group-hover:-translate-y-full flex items-center gap-3">{`${comentariosQuantidade} `}<img src={Svgs.comentario} alt="comentario" className={`h-4 ${userComentario ? "" : "invert"}`} /></span>
            <span className="absolute w-full top-full left-1/2 -translate-x-1/2 block transition-transform duration-300 group-hover:translate-y-[-100%] flex items-center gap-3">{`${comentariosQuantidade !== undefined ? userComentario ? comentariosQuantidade : comentariosQuantidade + 1 : comentariosQuantidade} `}<img src={Svgs.comentario} alt="comentario" className={`h-4 ${userComentario ? "invert" : ""}`} /></span>
          </p>
        </button>
    )
}