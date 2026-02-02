import { useEffect, useState } from "react";
import { Svgs } from "../../../assets/assets";
import { useAuth } from "../../../contexto/auth/useAuth";
import { EnviarPost, FileChange, GifConversor } from "./EnviarPostinterface";
import { Carregamento } from "../../Carregamento";
import { GifTab } from "./GifComponente/GifsComponente";
import { useQuery } from "@tanstack/react-query";
import { FetchPerfil } from "../../backend/Get";
import type { Perfil } from "../../Perfil/interface";

export const PostHome = ({ isComentarioPost, onClicar }: {
    isComentarioPost: boolean
    onClicar?: (e: React.FormEvent, comentarioHome: string) => void
}) => {

    const [conteudo, setConteudo] = useState<string>("")
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [abrirGifs, setAbrirGifs] = useState(false)
    const [mediaPreview, setMediaPreview] = useState<string | undefined>(undefined);


    const { usuario } = useAuth()

    const { data: Perfil } = useQuery({
            queryKey: ["perfil", usuario?.id || ""], queryFn: ({ queryKey }) => {
                const [, usuarioId] = queryKey
                if (usuarioId)
                    return FetchPerfil(usuarioId)
                return {} as Perfil
            }
    })
    
    const fotoPerfil = Perfil?.avatar_url

    const MutateOptionsBackend = EnviarPost()

    const MutateGifToFileBackend = GifConversor(setImageFile)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        if (MutateOptionsBackend.isPending) return
        try {
            await MutateOptionsBackend.IniciarEnvio({ titulo: Perfil?.name || "Post", conteudo, imageFile: imageFile, user_id: usuario!.id})
            setConteudo("")
            setImageFile(null)
            setAbrirGifs(false)

        }
        catch {
            console.log("Erro ao enviar");
        }
    }

    const handleGif = (gifUrl: string) => {
        if (MutateGifToFileBackend.isPending) return
        MutateGifToFileBackend.IniciarParametros(gifUrl, gifUrl.split("/")[4])
        setAbrirGifs(false)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = FileChange(event)
        if (!file) return
        setImageFile(file)
        setAbrirGifs(false)
    }

    const isVideo = imageFile ? imageFile.type.startsWith("video") ? true : false : false

    useEffect(() => {
        if (!imageFile) {
            setMediaPreview(undefined);
            return;
        }

        const url = URL.createObjectURL(imageFile);
        setMediaPreview(url);

        return () => {
            URL.revokeObjectURL(url); 
        };
    }, [imageFile]);

    return (
        <div>
            {usuario?.user_metadata && (<form onSubmit={(e: React.FormEvent) => {
                if (!usuario) {
                    alert("Você precisa estar logado")
                    e.preventDefault()
                } else {
                    if (isComentarioPost) onClicar!(e, conteudo)
                    else handleSubmit(e)
                }
            }} className="flex flex-col mb-1 p-5 border-gray-500 border-b-[1px]">
                <div className="flex gap-3">
                    <img src={fotoPerfil ? fotoPerfil : Svgs.user} alt="UsuarioFoto" className={`h-15 w-15 max-sm:h-10 max-sm:w-10 rounded-full object-cover ${fotoPerfil ?? "invert"}`} />
                    <textarea
                        value={conteudo}
                        required
                        className="
                            md:w-full
                            max-md:w-120
                            max-sm:w-[80vw] min-h-20 pl-3 pt-1 text-2xl resize-none outline-none border-none bg-transparent focus:ring-0 focus:outline-none scrollbar-hide"
                        placeholder={`${isComentarioPost ? "Escreva um comentário..." : "Escreva um post..."}`}
                        onChange={(e) => setConteudo(e.target.value)}
                        style={{ overflow: 'hidden' }}
                        rows={1}
                        onInput={e => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                    />
                </div>
                {abrirGifs && <div className="mx-auto mt-8 mb-8"><GifTab onSelect={(gifurl) => {
                    handleGif(gifurl);
                }} /></div>}
                <div className="flex sm:px-20 items-center justify-between ">
                    {isComentarioPost && (<div className="flex-1"></div>)}
                    <div className={`flex items-center gap-5 max-sm:gap-3 cursor-pointer ${isComentarioPost && "hidden"}`}>
                        <label htmlFor="file-upload" className="cursor-pointer inline-block">
                            <img
                                src={Svgs.fotoIcone}
                                alt="fotoicone"
                                className="h-15 max-sm:h-7 invert"
                            />
                        </label>
                        <input id="file-upload" name="file-upload" type="file" accept="video/mp4,image/jpeg,image/jpg,image/png,image/gif" className="sr-only"
                            onChange={handleFileChange}
                        />
                        <button type="button" onClick={() => setAbrirGifs((prev) => !prev)}>
                            <img src={Svgs.gif} alt="fotoicone" className="h-15 max-sm:h-7 invert cursor-pointer" />
                        </button>

                    </div>

                    <button type="submit" className={`group px-8 sm:py-2.5 sm:my-10 my-5 rounded-lg text-white
                    cursor-pointer active:scale-95 transition duration-300 w-40 max-sm:w-33 max-sm:h-9
                    ${MutateOptionsBackend.bgClass}`}>
                        <p className="relative h-6 overflow-hidden">
                            <span className="block transition-transform duration-300 group-hover:-translate-y-full">{MutateOptionsBackend.bgAviso}</span>
                            <span className="absolute w-full top-full left-1/2 -translate-x-1/2 block transition-transform duration-300 group-hover:translate-y-[-100%]">{MutateOptionsBackend.bgAvisoSecundario}</span>
                        </p>
                    </button>
                </div>
                {!MutateOptionsBackend.isPending && imageFile ? isVideo ? (<video src={mediaPreview}
                    className={`${imageFile ? "h-30 object-cover" : "invert h-15 w-15"} mx-auto`} controls />) : !MutateGifToFileBackend.isPending ? (<img src={mediaPreview ? mediaPreview : Svgs.correto} alt="fotoIcone" className={`${imageFile ? "h-30 object-cover" : "invert h-15 w-15"} mx-auto  `} />) : <Carregamento tamanho="8" texto="Carregando Gifs..." /> : (<></>)}
                {MutateOptionsBackend.isPending && <Carregamento tamanho="8" texto="Carregando..." />}
            </form>)}
        </div>
    )
}