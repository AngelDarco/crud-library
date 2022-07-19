import "./Cards.scss";
import Loading from "../assets/loading/Loading";
import useData from "../hooks/useData";
import { FaDownload } from "react-icons/fa";
import { BsFillBookmarkStarFill, BsBookmarkXFill } from "react-icons/bs";
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
// import { useState, useRef, useEffect } from "react";
//import { auth } from '../../fbConfig/firebase-config';

const Cards = () => {
  const { data, loading } = useData();

  const handlerLikes = (res) => {
    console.log(res)
  };

  return (
    <div className="cardsContainer" onLoad={fetch}>
      {loading ? (
        <Loading />
      ) : (
        data?.map((res) => (
          <div className="card" key={res.id}>
            <div className="icons">
              <div>
                { res.avalible === 'true' ? <BsFillBookmarkStarFill className="avalible"/> 
                                          : <BsBookmarkXFill className="unavalible"/>}
              </div>
              <div>
                <FaDownload className={res.download === 'true' ? 'download' : 'undownload'}/>

                <div className="likes" onClick={()=>handlerLikes(res)}>
                  { res.like === 'true' ? <AiTwotoneLike className="like" /> 
                                        : <AiOutlineLike className="dislike"/>}
                </div>
              </div>
            </div>
            <img src={res.url} alt={res.name} />
            <p>{res.name}</p>
            <p>{res.autor}</p>
          </div>
        ))
      )}
    </div>
  );
};
export default Cards;
