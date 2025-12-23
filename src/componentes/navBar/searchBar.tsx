import { Svgs } from "../../assets/assets"


const SearchBar = () =>{
    return (
         <div className='flex items-center text-sm gap-2 border border-purple-400 px-3 rounded-full lg:w-[440px] sm:w-80 text-white sm:mr-5 sm:ml-5'>
            <img src={Svgs.simboloMenu} alt="dad" className="sm:hidden h-8 w-8 invert" />
            <input type="text" className='py-1.5 w-full bg-transparent outline-none placeholder-gray-400' placeholder='Procurar' />
            <img src={Svgs.pesquisarIcone} alt="search" className='h-4 invert'/>
        </div>
    )
}

export default SearchBar