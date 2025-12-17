import { BrowserRouter, Route, Routes } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Home from "./paginas/home"
import NavBar from "./componentes/navBar"
import { SideBar } from "./componentes/sideBar"
import { Svgs } from "./assets/assets"
import { SidebarItem } from "./componentes/sideBarItems"

export const App = () => {
  const cliente = new QueryClient()

  return (
    <QueryClientProvider client={cliente}>
      <BrowserRouter>
        <NavBar />
        <div className="pt-16 h-screen flex bg-black text-gray-100">
          <SideBar>
            <SidebarItem icon={Svgs.home} text="Home" link="/" />
            <SidebarItem icon={Svgs.post} text="Criar Post" link="/criar" />
            <SidebarItem icon={Svgs.comunidade} text="Comunidades" link="/comunidades" />
            <SidebarItem icon={Svgs.criarComunidade} text="Criar Comunidades" link="/comunidade/criar" />
          </SideBar>
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
