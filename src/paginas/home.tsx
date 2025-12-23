import PostList from "../componentes/Post/PostList"

const Home = () =>{
    return (
        <div className="bg-[#0E1113] p-5">
            <h2 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Recents Posts</h2>
            <PostList/>
        </div>
    )
}

export default Home