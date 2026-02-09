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
import { ConfirmarEmail } from "./componentes/SignInUp/ConfirmarEmail"
import { SignUp } from "./componentes/SignInUp/SignUp"
import { SignIn } from "./componentes/SignInUp/SignIn"
import { Perfil } from "./componentes/Perfil/Perfil"
import { BoxMessage } from "./paginas/BoxMessage"
import { Chat } from "./componentes/mensagem/Chat"
import { ScrollProvider } from "./contexto/scroll/scrollProvider"
import { Layout } from "./paginas/Layout"

export const App = () => {
  const cliente = new QueryClient()

  return (
    <QueryClientProvider client={cliente}>
    <BrowserRouter>
    <AuthProvider>
      <SidebarProvider>
        <NavBar />
        <div className="pt-16 h-screen flex bg-black text-gray-100">
          <SideBar>
            <SidebarItem icon={Svgs.home} text="Home" link="/" />
            <SidebarItem icon={Svgs.post} text="Criar Post" link="/criar" />
            <SidebarItem icon={Svgs.messsage} text="Caixa de Mensagem" link="/box_message"/>
            <SidebarItem icon={Svgs.comunidade} text="Comunidades" link="/comunidades" />
            <SidebarItem icon={Svgs.user} text="Perfil"/>
          </SideBar>
        <ScrollProvider>
           <Layout>
            <ScrollToTop/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/criar" element={<CriarPost/>}/>
              <Route path="/post/:id" element={<PostPage/>}/>
              <Route path="/email_confirmar/:email" element={<ConfirmarEmail/>}/>
              <Route path="/signup" element={<SignUp/>}/>
              <Route path="/signin" element={<SignIn/>}/>
              <Route path="/perfil/:userId" element={<Perfil/>}/>
              <Route path="/box_message" element={<BoxMessage/>}/>
              <Route path="/chat/:chatId" element={<Chat/>}/>
            </Routes>
          </Layout>
        </ScrollProvider>
        </div>
      </SidebarProvider>
    </AuthProvider>
    </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
