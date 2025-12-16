// import { BrowserRouter,Route,Routes} from "react-router"
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import Home from "./paginas/home.tsx"
// import NavBar from "./componentes/navBar.tsx"

// export const App = () => {
  
//   const cliente = new QueryClient()

//   return (
//     <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
//      <QueryClientProvider client={cliente}>
//       <BrowserRouter>
//         <NavBar/>
//       <div className="container mx-auto px-4 py-6">     
//         <Routes>
//           <Route path="/" element={<Home/>}/>
//         </Routes>
//       </div>
//       </BrowserRouter>
//      </QueryClientProvider>
//     </div>
//   )
// }

// export default App

import { BrowserRouter, Route, Routes } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Home from "./paginas/home"
import NavBar from "./componentes/navBar"
import { SidebarItem,SideBar } from "./componentes/sideBar"
import { Svgs } from "./assets/assets"

export const App = () => {
  const cliente = new QueryClient()

  return (
    <QueryClientProvider client={cliente}>
      <BrowserRouter>

        {/* NAVBAR FIXA */}
        <NavBar />

        {/* ÁREA ABAIXO DA NAVBAR */}
        <div className="pt-16 h-screen flex bg-black text-gray-100">

          {/* SIDEBAR FIXA */}
          <SideBar>
            <SidebarItem icon={Svgs.menu} text="Statisticas"/>
            <SidebarItem icon={Svgs.menu} text="Adhdada"/>
            <SidebarItem icon={Svgs.menu} text="Ajhdjan ad"/>
            <SidebarItem icon={Svgs.menu} text="Indasmdakd"/>
          </SideBar>

          {/* CONTEÚDO QUE ROLA */}
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </main>

        </div>

      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
