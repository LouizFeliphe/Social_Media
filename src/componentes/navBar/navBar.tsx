import { Link, useNavigate } from "react-router";
import { Svgs } from "../../assets/assets";
import SearchBar from "./searchBar";
import { useSidebar } from "../../contexto/sideBar/useSideBar";
import { useAuth } from "../../contexto/auth/useAuth";
import Botao from "./botao";


const NavBar = () => {

    const { expandir, toggle } = useSidebar()

    const { singOut, usuario } = useAuth()
    const navegar = useNavigate()

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

                    <SearchBar />

                    {/*Mobile menu botao*/}
                    <div className="lg:hidden mx-auto p-0">
                        <button onClick={() => toggle()} className="text-gray-300 focus:outline-none" aria-label="Toggle Menu">{
                            expandir ?
                                <img src={Svgs.xFechar} alt="menu" className="h-10 invert my-auto" />
                                :
                                <img src={Svgs.menu} alt="fechar" className="h-10 invert my-auto" />
                        }
                        </button>
                    </div>

                     {/*Login signout*/}
                    {usuario?.user_metadata ? <Botao texto="SignOut" funcao={singOut}/> : <Botao texto="Log-in" funcao={()=>{
                        navegar("/signin")
                    }}/> }
                </div>
            </div>
        </nav>
    )

}

export default NavBar;