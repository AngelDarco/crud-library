import "./Cards.scss";
import 'sweetalert2/src/sweetalert2.scss'
import Loading from "../assets/loading/Loading";
import useData from "../hooks/firebase/useData";
import { FaDownload } from "react-icons/fa";
import { BsFillBookmarkStarFill, BsBookmarkXFill } from "react-icons/bs";
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import { Auth } from "../../context/Context";
import useDownload from "../hooks/firebase/UseDownload";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const Cards = () => {
  const {userData} = Auth();
  const { uid } = userData;
  const { ReadData, UpdateData } = useData();
  const file = useDownload()
  const [ data, setData ] = useState([])
  const [loading, setLoading] = useState(true);


  // LoginData();
  const {user,publics} = ReadData();
  useEffect(()=>{

        if (user.length >= 1){
          let arr = publics;
            if (user[0].id){
           // many renders
           publics?.map((pub,i)=>{
            user?.map(usr =>{
                if(usr.id === pub.id){
                  arr[i] = usr
                }
              })
                // arr.push(pub)
            })
              setData(arr)  
              data && setLoading(false)
          }
            else {
          //  first  render
             const usrData = Object.values(user[0]);
             publics?.map((pub,i)=>{
              usrData?.map(usr =>{
                  if(usr.id === pub.id){
                    arr[i] = usr
                  }
                })
                  // arr.push(pub)
              })
                setData(arr)  
                data && setLoading(false)
            }
        }else {
          setData(publics)
          data && setLoading(false)
        }

        return ()=>{}
        //eslint-disable-next-line
      },[user,publics])

  
  const alert = (icon, title, timer, position='center')=>{
    Swal.fire({
      position,
      icon,
      title,
      showConfirmButton: false,
      timer
    })
  }

  const handlerDownload = (res)=>{
    if(uid === '') {
      alert('error','Sorry, You must log first',1000,'center',true)
    return
    }

    if(res.download){
      Swal.fire({
        title: 'Want download again?',
        text: "You want download this file again!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Download'
      }).then((result) => {
        if (result.isConfirmed) {
            alert('success','Downloading ...',500,'center')
            window.location.href = file;
        }
      })
      return
    }
      window.location.href = file;
      UpdateData({...res,
      download: true,
      avalible: false
    })  

  }

  const HandlerLikes = (res) => {
    if(uid === '') {
      alert('error','Sorry, You must log first',1000,'center',true)
    return
    }
    
    !res.like && alert('success','Like',500,'top-right')
    UpdateData({...res, like: !res.like})
  };

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
