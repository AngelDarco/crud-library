import "./Cards.scss";
import "sweetalert2/src/sweetalert2.scss";
import { FaDownload } from "react-icons/fa";
import { BsBookmarkXFill } from "react-icons/bs";
import { RiBookmark3Fill } from "react-icons/ri";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaTrashCan } from "react-icons/fa6";
import { useState, useEffect, useContext } from "react";
import { CirclesWithBar } from "react-loader-spinner";

import HandlerActions from "../../utils/HandlerActions";
import HandlerData from "../../utils/HandlerData";
import { context } from "../../context/Context";

const Cards = () => {
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(false);
  const [data, setData] = useState(undefined);
  const { uid, user } = useContext(context);

  // retrieve data from firebase
  const dataHandler = new HandlerData(uid);

  // give the interaction buttons functionality
  const actions = new HandlerActions(uid, user);

  // pass the data to the interaction buttons class
  async function getData() {
    const allData = [];
    const data = await dataHandler.ReadData();
    const retrievedData = await actions.handlerAllData(data);
    retrievedData.forEach((value) => allData.push(value));
    return allData;
  }

  useEffect(() => {
    getData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [uid, action]);

  const handlerActions = async (fn) => {
    await fn();
    setAction(!action);
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
                  <RiBookmark3Fill className="avalible" />
                ) : (
                  <BsBookmarkXFill className="unavalible" />
                )}
              </div>
              <div>
                <FaDownload
                  onClick={() =>
                    handlerActions(() =>
                      actions.handlerDownload(res, "download")
                    )
                  }
                  className={res.download ? "download" : ""}
                />
                <div className="likes">
                  {res.like ? (
                    <AiFillLike
                      onClick={() =>
                        handlerActions(() => actions.HandlerLikes(res))
                      }
                      className="like"
                    />
                  ) : (
                    <AiOutlineLike
                      onClick={() =>
                        handlerActions(() => actions.HandlerLikes(res))
                      }
                    />
                  )}
                </div>
                <FaTrashCan
                  onClick={() =>
                    handlerActions(() => actions.HandlerDelete(res))
                  }
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
