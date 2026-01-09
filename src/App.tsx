import { BrowserRouter, Route, Routes } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Home from "./paginas/home"
import NavBar from "./componentes/navBar/navBar"
import { Svgs } from "./assets/assets"
import { SidebarProvider } from "./contexto/sideBar/sideBarProvider"
import { AuthProvider } from "./contexto/auth/AuthProvider"
import CriarPost from "./paginas/criarPost"
import { PostPage } from "./paginas/PostPage"
import { SidebarItem } from "./componentes/sideBar/sideBarItems"
import { SideBar } from "./componentes/sideBar/sideBar"
import { ScrollToTop } from "./paginas/Scroll"



export const App = () => {
  const cliente = new QueryClient()

  return (
    <QueryClientProvider client={cliente}>
    <AuthProvider>
    <BrowserRouter>
      <SidebarProvider>
      <div className="">
        <NavBar />
        <div className="pt-16 h-screen flex bg-black text-gray-100">
          <SideBar>
            <SidebarItem icon={Svgs.home} text="Home" link="/" />
            <SidebarItem icon={Svgs.post} text="Criar Post" link="/criar" />
            <SidebarItem icon={Svgs.comunidade} text="Comunidades" link="/comunidades" />
            <SidebarItem icon={Svgs.criarComunidade} text="Criar Comunidades" link="/comunidade/criar" />
          </SideBar>

          <main className="flex-1 overflow-y-auto overscroll-y-contain" >
            <ScrollToTop/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/criar" element={<CriarPost/>}/>
              <Route path="/post/:id" element={<PostPage/>}/>
            </Routes>
          </main>
        </div>
      </div>
      </SidebarProvider>
    </BrowserRouter>
    </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
