import useData from "../firebase/useData";
import { Auth } from "../../../context/Context";
import useDownload from "../firebase/UseDownload";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

const useCardFunctions = () => {
    const { userData } = Auth();
    const { uid } = userData;
    const { UpdateData, DeleteData, ReadData } = useData();
    const file = useDownload();
    const { user, publics } = ReadData();
    
    const HandlerData = ()=>{
        const [ data, setData ] = useState([])
        useEffect(()=>{
            let mounted = true;
                if (user.length >= 1){
                  if (user[0].id){
                      let arr = publics;
                   publics?.map((pub,i)=>{
                    user?.map(usr =>{
                        if(usr.id === pub.id){
                          arr[i] = usr
                        }
                      })
                    })
                    mounted &&
                      setData(arr)  
                  }
                    else {
                  let arr = publics;
                     const usrData = Object.values(user[0]);
                     publics?.map((pub,i)=>{
                      usrData?.map(usr =>{
                          if(usr.id === pub.id){
                            arr[i] = usr
                          }
                        })
                      })
                      mounted &&
                        setData(arr)  
                    }
                }else {
                  mounted &&
                  setData(publics)
                }
                
              return ()=> { mounted = false}
              //eslint-disable-next-line
              },[user,publics])
        return data;
    }

    const alert = (icon, title, timer, position = 'center') => {
        Swal.fire({
            position,
            icon,
            title,
            showConfirmButton: false,
            timer
        })
    }

    const handlerDownload = (res) => {
        if (uid === '') {
            alert('error', 'Sorry, You must log first', 1000, 'center', true)
            return
        }

        if (res.download) {
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
                    alert('success', 'Downloading ...', 500, 'center')
                    window.location.href = file;
                }
            })
            return
        }
        window.location.href = file;
        UpdateData({
            ...res,
            download: true,
            avalible: false
        })

    }

    const HandlerLikes = (res) => {
        if (uid === '') {
            alert('error', 'Sorry, You must log first', 1000, 'center', true)
            return
        }
        !res.like && alert('success', 'Like', 500, 'top-right')
        UpdateData({ ...res, like: !res.like })
        
    }

    const handlerDelete = (itm)=>{
      if(uid === '') { 
       alert('error','Sorry, You must log first', 1500)
        return
    }
      itm.owner === uid ?
      (DeleteData(itm,true), alert('success','deleted',1000))
      : alert('warning','You just can delete your books', 1500)
    }

    return { HandlerLikes, handlerDownload, handlerDelete, HandlerData }

}
export default useCardFunctions;