import { Link } from "react-router";
import { Svgs } from "../assets/assets";
import SearchBar from "./searchBar";
import { useSidebar } from "../contexto/sideBar/useSideBar";
import { useAuth } from "../contexto/auth/useAuth";


const NavBar = () => {

    
    const { expandir, toggle} = useSidebar()

    const {signInWithGoogle, singOut, usuario} = useAuth()

    const mostrarNome = usuario?.user_metadata.name 
    const mostrarEmail = usuario?.email

    return (
        <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/70 shadow-lg">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    
                    <Link to={"/"} className="font-mono text-xl font-bold text-white">
                        <div className="flex justify-center items-center gap-3 max-sm:hidden">
                            <img src={Svgs.simboloMenu} alt="logo" className={`h-15  invert`} />
                            <div className="flex justify-center item-center">
                                Anar 
                                <span className="text-purple-500">chy</span>
                            </div>
                        </div>
                    </Link>

                    <SearchBar/>

                    {/* <div className="hidden md:flex lg:hidden items-center space-x-8">
                        <Link to={"/"} className="text-gray-300 hover:text-white transition-colors">Home</Link>
                        <Link to={"/criar"} className="text-gray-300 hover:text-white transition-colors">Criar Post</Link>
                        <Link to={"/comunidades"} className="text-gray-300 hover:text-white transition-colors">Comunidades</Link>
                        <Link to={"/comunidade/criar"} className="text-gray-300 hover:text-white transition-colors">Criar comunidade</Link>
                    </div> */}

                    {/*Mobile menu botao*/}
                    <div className="lg:hidden">
                        <button onClick={() => toggle()} className="text-gray-300 focus:outline-none" aria-label="Toggle Menu">{
                            expandir ?
                                <img src={Svgs.xFechar} alt="menu" className="h-10 invert my-auto" />
                                :
                                <img src={Svgs.menu} alt="fechar" className="h-10 invert my-auto" />
                        }
                        </button>
                    </div>

                    <div onClick={()=> signInWithGoogle()}>
                        {usuario ? (
                            <div>
                                <span className="text-white">{mostrarNome}{mostrarEmail}</span>
                           
                            </div>
                        ):(<div></div>)}
                        <button className="text-white"> Entrar com Google</button>
                    </div>
                         {mostrarNome && <button onClick={()=>singOut()}className="text-white">Deslogar</button>}
                    {/*Mobile*/}
                    {/* {menuAberto && (
                        <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <Link to={"/"} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Home</Link>
                                <Link to={"/criar"} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Criar Post</Link>
                                <Link to={"/comunidades"} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Comunidades</Link>
                                <Link to={"/comunidade/criar"} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Criar comunidade</Link>
                            </div>
                        </div>)
                    } */}

                
                </div>
            </div>
        </nav>
    )

}

export default NavBar;