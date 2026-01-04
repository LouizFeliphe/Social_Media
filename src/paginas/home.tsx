import { PostHome } from "../componentes/Post/CriarPost/PostHome"
import PostList from "../componentes/Post/PostList"


const Home = () =>{   

    return (
        <div className="bg-[#0E1113] sm:p-5">
            <PostHome/>
            <PostList/>
        </div>
    )
}

export default Home