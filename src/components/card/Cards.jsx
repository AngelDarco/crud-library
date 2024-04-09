import "./Cards.scss";
import "sweetalert2/src/sweetalert2.scss";
import { FaDownload } from "react-icons/fa";
import { BsFillBookmarkStarFill, BsBookmarkXFill } from "react-icons/bs";
import { AiOutlineLike, AiTwotoneLike, AiFillDelete } from "react-icons/ai";
import { useState, useEffect, useContext } from "react";
import { CirclesWithBar } from "react-loader-spinner";

import HandlerActions from "../../utils/HandlerActions";
import HandlerData from "../../utils/HandlerData";
import { context } from "../../context/Context";

const Cards = () => {
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(false);
  const [data, setData] = useState(undefined);
  const { uid } = useContext(context);

  // retrieve data from firebase
  const dataHandler = new HandlerData(uid);

  // give the interaction buttons functionality
  const actions = new HandlerActions(uid);

  // pass the data to the interaction buttons class
  async function getData() {
    const allData = [];
    const data = await dataHandler.ReadData();
    const retrievedData = await actions.handlerAllData(data);
    retrievedData.forEach((value) => allData.push(value));
    return allData;
  }

  useEffect(() => {
    if (uid)
      getData().then((res) => {
        setData(res);
        setLoading(false);
      });
  }, [uid, action]);

  const handlerActions = (fn) => {
    if (fn) {
      fn;
      setAction(!action);
    }
  };

  return (
    <div className="cardsContainer">
      {loading ? (
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
        data &&
        data?.map((res) => (
          <div className="card" key={res.id}>
            <div className="icons">
              <div className="avalible">
                {res.avalible ? (
                  <BsFillBookmarkStarFill className="avalible" />
                ) : (
                  <BsBookmarkXFill className="unavalible" />
                )}
              </div>
              <div>
                <FaDownload
                  onClick={() =>
                    handlerActions(actions.handlerDownload(res, "download"))
                  }
                  className={res.download ? "download" : ""}
                />
                <div className="likes">
                  {res.like ? (
                    <AiTwotoneLike
                      onClick={() => handlerActions(actions.HandlerLikes(res))}
                      className="like"
                    />
                  ) : (
                    <AiOutlineLike
                      onClick={() => handlerActions(actions.HandlerLikes(res))}
                    />
                  )}
                </div>
                <AiFillDelete
                  onClick={() => handlerActions(actions.HandlerDelete(res))}
                />
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
