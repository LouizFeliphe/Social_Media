import { useRef, useState } from "react";
import { Svgs } from "../../../../assets/assets"
import type { Perfil } from "./interface";
import { EditarPerfilInterface, FileChange } from "../EnviarPostinterface";


export const EditarPerfil = ({ onEditar, Perfil }: {
    onEditar: () => void,
    Perfil: Perfil | undefined
}) => {

    const [nome, setNome] = useState(() => Perfil?.name ?? "");
    const fileInputImageBackgroundRef = useRef<HTMLInputElement>(null);
    const [imageFileBackground, setImageFileBackGround] = useState<File | null>(null);
    const fileInputImageProfileRef = useRef<HTMLInputElement>(null);
    const [imageFileProfile, setImageFileProfile] = useState<File | null>(null)
    const [about, setAbout] = useState(() => Perfil?.about ?? "")
    const [localizacao, setLocalizacao] = useState(() => Perfil?.location ?? "")

    const MutateOptionsBackend = EditarPerfilInterface(onEditar)


    const HandleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if(nome === Perfil?.name && about === Perfil?.about && localizacao === Perfil?.location && !imageFileBackground && !imageFileProfile) {
            onEditar()
            return
        }
        MutateOptionsBackend.IniciarParametros(Perfil!.user_id,nome,imageFileBackground,imageFileProfile,about,localizacao)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, tipo: string) => {
        const file = FileChange(event, true)
        if(!file) return
        if(tipo === "background") setImageFileBackGround(file)
        else setImageFileProfile(file)
    }


    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40"></div>
            <form onSubmit={HandleSubmit} className="fixed
      top-[0%] left-[15%]
      max-md:top-0 max-md:left-0
      z-[9999]
      bg-[#232a2e]
      w-[70%]
      max-md:w-screen
      max-md:min-h-screen
      p-5
      rounded-md
      max-h-[100dvh]
      overflow-y-auto">
                <div className="flex justify-between pb-2">
                    <div className="flex items-center justify-center gap-5">
                        <button type="submit" onClick={onEditar}><img src={Svgs.xFechar} alt="fechar" className="h-8 invert" /></button>
                        <span className="text-xl">EditarPerfil</span>
                    </div>
                    {MutateOptionsBackend.isPending ? <button type="submit" className="rounded-lg py-1.5 px-4.5 border-2 border-white text-lg bg-yellow-600" disabled={true}>Carregando...</button> : <button type="submit" className="rounded-lg py-1.5 px-4.5   border-2 border-white text-lg hover:bg-gray-600">Salvar</button>}
                </div>
                <div className="border-[1px]">
                    <img src={imageFileBackground ? URL.createObjectURL(imageFileBackground) : Perfil?.background ? Perfil.background : Svgs.noneBackground} className="w-full p-1.5 h-65 object-cover brightness-45" onClick={() => fileInputImageBackgroundRef.current?.click()} />
                    <input
                            ref={fileInputImageBackgroundRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            className="hidden"
                            onChange={(e) => handleFileChange(e,"background")}
                        />

                    <div></div>
                    <div className={`absolute ${imageFileBackground ? "top-[33%] left-[41%]" : "top-[33%] left-[45%]"} z-10 flex items-center gap-20 bg-black/50 rounded-lg`}>
                        { imageFileBackground && <img src={Svgs.xFechar} alt="fechar" onClick={()=>{
                            setImageFileBackGround(null)
                        }} className="h-10 invert cursor-pointer"/>}
                        <img src={Svgs.fotoIcone} alt="foto" className="h-10 invert cursor-pointer" onClick={() => fileInputImageBackgroundRef.current?.click()}/>
                    </div>
                    <div className="absolute top-47 left-10 z-10 bg-[#262626] flex justify-center rounded-full border-3 border-black">
                        <img
                            src={ imageFileProfile ? URL.createObjectURL(imageFileProfile) : Perfil?.avatar_url ? Perfil.avatar_url : Svgs.noneBackground }
                            className="h-40 w-40 rounded-full border-4 border-white brightness-45 cursor-pointer"
                            onClick={() => fileInputImageProfileRef.current?.click()}
                        />

                        <input
                            ref={fileInputImageProfileRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            className="hidden"
                           onChange={(e) => handleFileChange(e,"profile")}
                        />

                        <div className="absolute top-[39%] left-[37%] z-10 flex items-center gap-20 bg-black/30 rounded-lg">
                            <img src={Svgs.fotoIcone} alt="foto" className="h-10 invert cursor-pointer" onClick={() => fileInputImageProfileRef.current?.click()} />
                        </div>
                    </div>
                </div>
                <div className="mt-5 mb-3">
                    {MutateOptionsBackend.error && <span className="text-red-600">Houve um erro</span>}
                    <label htmlFor="nome" className="block mb-1 font-medium text-slate-300">Nome</label>
                    <input type="nome" id="nome" maxLength={15} name="password" onChange={(e) => setNome(e.target.value)} value={nome} placeholder="Senha com 8 digitos..."
                        className="w-full p-2 mb-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500" />
                    <label htmlFor="local" className="block mb-1 font-medium text-slate-300">Localização</label>
                    <input type="local" id="local" name="local" maxLength={20} value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} placeholder="Local do usuário..."
                        className="w-full p-2 mb-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500" />
                    <label htmlFor="conteudo" className="block text-sm/6 font-medium text-white">
                        Sobre
                    </label>
                    <div className="mt-2">
                        <textarea
                            id="conteudo"
                            name="conteudo"
                            rows={7}
                            value={about}
                            maxLength={450}
                            onChange={(e) => setAbout(e.target.value)}
                            placeholder="Conte mais sobre você..."
                            className="block w-full rounded-md bg-slate-900  px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                        />
                    </div>
                </div>
            </form>
        </>
    )
}