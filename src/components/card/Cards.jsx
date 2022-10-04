import "./Cards.scss";
import 'sweetalert2/src/sweetalert2.scss'
import Loading from "../assets/loading/Loading";
import { FaDownload } from "react-icons/fa";
import { BsFillBookmarkStarFill, BsBookmarkXFill } from "react-icons/bs";
import { AiOutlineLike, AiTwotoneLike, AiFillDelete } from "react-icons/ai";
import useCardFunctions from "../hooks/card/useCardFunctions";
import { useState, useEffect } from "react";

const Cards = () => {
  const { handlerDownload, HandlerLikes, handlerDelete, HandlerData } = useCardFunctions();
  const data = HandlerData();
  const [loading, setLoading] = useState(true);

useEffect(()=>{
  data.length !== 0 && setLoading(false);
},[data])

  return (
    <div className="cardsContainer">
      {loading ? (
        <Loading />
      ) : (
        data?.map((res) => (
          <div className="card" key={res.id}>
            <div className="icons">
              <div>
                { res.avalible ? <BsFillBookmarkStarFill className="avalible"/> 
                                          : <BsBookmarkXFill className="unavalible"/>}
              </div>
              <div>
                <FaDownload onClick={()=> handlerDownload(res,'download')} className={res.download ? 'download' : 'undownload'}/>
                <div className="likes">
                  { res.like ? <AiTwotoneLike onClick={()=>HandlerLikes(res)} className="like" /> 
                                        : <AiOutlineLike onClick={()=>HandlerLikes(res)} className="dislike"/>}
                </div>
                <AiFillDelete onClick={()=>handlerDelete(res)} style={{color:'red'}}/>
              </div>
            </div>
            <img src={res.img} alt={res.name} />
            <p>{res.name}</p>
            <p>{res.autor}</p>
          </div>
        ))
      )}
    </div>
  );
};
export default Cards;