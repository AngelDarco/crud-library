import "./Cards.scss";
import 'sweetalert2/src/sweetalert2.scss'
import { FaDownload } from "react-icons/fa";
import { BsFillBookmarkStarFill, BsBookmarkXFill } from "react-icons/bs";
import { AiOutlineLike, AiTwotoneLike, AiFillDelete } from "react-icons/ai";
import useCardFunctions from "../hooks/card/useCardFunctions";
import { useState, useEffect } from "react";
import { CirclesWithBar } from "react-loader-spinner";

const Cards = () => {
  const { handlerDownload, HandlerLikes, handlerDelete, HandlerData } = useCardFunctions();
  const data = HandlerData();
  const [loading, setLoading] = useState(true);

useEffect(()=>{
  data.length !== 0 && setLoading(false);
},[data])

  return (
    <div className="cardsContainer">
      { loading ? (
        <CirclesWithBar 
          width="200"
          height="200"
          wrapperStyle={{
            position: "absolute",
            top: "50%",
            left: "35%",
            transform: "translate(-50%, -50%)",
          }}
        />
) : (
        data?.map((res) => (
          <div className="card" key={res.id}>
            <div className="icons">
              <div className='avalible'>
                { res.avalible ? <BsFillBookmarkStarFill className="avalible"/> 
                                          : <BsBookmarkXFill className="unavalible"/>}
              </div>
              <div>
                <FaDownload onClick={()=> handlerDownload(res,'download')} className={res.download ? 'download' : ''}/>
                <div className="likes">
                  { res.like ? <AiTwotoneLike onClick={()=>HandlerLikes(res)} className="like" /> 
                                        : <AiOutlineLike onClick={()=>HandlerLikes(res)}/>}
                </div>
                <AiFillDelete onClick={()=>handlerDelete(res)}/>
              </div>
            </div>
            <img src={res.img} alt={res.name} />
            <div className="textCard">
            <p>{res.name}</p>
            <span>{res.autor}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
export default Cards;