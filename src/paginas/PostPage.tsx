import { useParams } from "react-router";
import { PostDetail } from "../componentes/Post/PostDetail";


export const PostPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="pt-7">
      <PostDetail postId={Number(id)} isHome={false}/>
    </div>
  );
};