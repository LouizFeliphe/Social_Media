import { useEffect, useState } from "react"
import { useAuth } from "../../contexto/auth/useAuth"
import { Link, useNavigate } from "react-router"
import { Carregamento } from "../Carregamento"
import { Svgs } from "../../assets/assets"


export const SignIn = () => {

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")
    const [loading, setLoading] = useState(false)

    const navegar = useNavigate()
    const { signInWithEmail, signInWithGoogle, usuario } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await signInWithEmail(email, senha)
            setLoading(false)
        } catch (erro) {
            console.log("Erro no signIn: " + erro);
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        if (usuario?.user_metadata) {
            navegar("/")
        }
    }, [navegar, usuario?.user_metadata])



    return (
        <div className="flex flex-col justify-center w-full sm:max-w-90 max-sm:w-full max-sm:h-screen rounded-xl px-6 py-8 border border-slate-700 bg-slate-900 text-white text-sm mx-auto sm:mt-7 sm:mb-10">
            <div className="flex items-center gap-10">
                <div> <h2 className="text-2xl font-semibold">SignIn</h2>
                    <p className="text-slate-300 mt-1">Entrar com email ou senha</p></div>
                <span className="">OU</span>
                <button type="button" className="max-sm:w-[50%] w-40 p-3 text-sm flex items-center justify-center gap-1 font-medium text-black bg-white/90 rounded-md hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={() => {
                    signInWithGoogle()
                }}>
                    <img src={Svgs.google} alt="google" className="h-4" />
                    Entrar
                </button>
            </div>

            <form className="mt-8" onSubmit={handleSubmit}>
                <label htmlFor="email" className="block mb-1 font-medium text-slate-300">Email</label>
                <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email@gmail.com" className="w-full p-2 mb-3 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500" />

                <label htmlFor="password" className="block mb-1 font-medium text-slate-300">Senha</label>
                <input type="password" id="password" name="password" placeholder="Senha com 8 digitos..."
                    onChange={(e) => setSenha(e.target.value)} className="w-full p-2 mb-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500" />
                <div className="text-right">
                    <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Não possui conta ? Cadastre-se aqui !</Link>
                </div>
                {loading ? (<Carregamento tamanho="10" texto="Cadastrando..." />) : (<button type="submit" className="w-full mt-10 px-4 py-2.5 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Log-in</button>)}
                {erro && (<span className="text-red-600 text-md">{erro}</span>)}
            </form>
        </div>
    )
}