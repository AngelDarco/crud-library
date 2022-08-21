import { getDatabase, ref, set, onValue, update, remove } from 'firebase/database';
import { getStorage, uploadBytes, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { Auth } from '../../../context/Context';
import uuid from 'react-uuid';

import { useState, useEffect, useCallback } from 'react';

const useData = () => {
    const [loading, setLoading] = useState(true);
    const [render, setRender] = useState(false);

    const db = getDatabase();
    const { userData } = Auth();
    const { uid } = userData;

    function WriteData({ autor, name, img }) {
        if (!autor || !name || !img) return
        const key = uuid()
        const loadImg = () => {
            const storage = getStorage();
            const refImg = storageRef(storage, 'Books/' + key + img.name);

            return new Promise((resolve, reject) =>
                uploadBytes(refImg, img)
                    .then(snapshot => {
                        getDownloadURL(storageRef(storage, snapshot.metadata.fullPath))
                            .then(link => {
                                resolve(link)
                            });
                    })
                    .catch(err => reject(err.message))
            )
        }

        return new Promise((resolve, reject) =>
            loadImg()
                .then(res => {
                    set(ref(db, 'books/public/' + key), {
                        id: key,
                        autor,
                        name,
                        img: res,
                        avalible: true,
                        download: false,
                        like: false,
                        owner: uid
                    })
                        .then(() => {
                            resolve()
                        })
                })
                .catch(err => reject(err.message))
        )
    }


    function ReadData() {
        const [data, setData] = useState([]);
        const [publicData, setPublicData] = useState([]);
        const [usersData, setUsersData] = useState([]);


        useEffect(() => {
                    onValue(ref(db, 'books/public/'), snapshot => {
                        // setPublicData([]);
                        const database = snapshot.val();
                        if (database !== null) {
                            let arr = [];
                            Object.values(database).map(db => {
                                arr.push(db);
                            })
                            setPublicData(arr);
                        }
                    })
                    // return(()=>setPublicData([]))
        }, [])

        useEffect(() => {
                    onValue(ref(db, 'books/users/' + uid), snapshot => {
                        // setUsersData([]);
                        const database = snapshot.val();
                        let arr = [];
                        if (database !== null) {
                            Object.values(database).map(db => {
                                arr.push(db);
                            })
                            setUsersData(arr)
                        }
                    })
                    // return(()=>setUsersData([]))
                    //eslint-disable-next-line
        }, [render])




        useEffect(()=>{
            // console.log(usersData,publicData)
            // if(usersData.length === 0){
            //     console.log('en el if')
            //     setData(publicData);
            //     setLoading(false);
            //     return
            //  }
           
                // console.log('en el else')         
                if(data.length !== 0){
                usersData.map(item => {
                    setData(newArr(publicData,item))
                })
                    setLoading(false)
                }
                
        },[data.length, publicData, usersData])



        const newArr = (publicDB, usersDB)=> {
            console.log('in the function')

            const arr = [];
            publicDB.map(itemPublic => {
                let item; 
                if(!usersDB.id){
                    console.log('if function')
                    Object.values(usersDB).map(itemUser =>{
                    itemPublic.id === itemUser.id 
                    ? item = itemUser
                    : item = itemPublic    
                    })
                }else{
                    console.log('else function')
                    itemPublic.id === usersDB.id
                    ? item = usersDB
                    : item = itemPublic
                }
                    item
                    ? arr.push(item)
                    : arr.push(itemPublic)
            })
            console.log(arr)
            return arr
        }

        
    return data

    } //end method 



    function UpdateData(newData) {
        if (uid !== '' && newData.id){            
            update(ref(db, 'books/users/' + uid + '/' + newData.id), newData)
            .then(setRender(!render))
        }
    }
    

    function DeleteData(item){
        console.log(item.id)
        remove(ref(db,'books/users/'+uid+'/'+item.id))
        .then(()=> setRender(!render))
        .catch(err=>console.log(err));
    }

    return { WriteData, ReadData, UpdateData, DeleteData, loading };
}
export default useData;