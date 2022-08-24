import { getDatabase, ref, set, onValue, update, remove } from 'firebase/database';
import { getStorage, uploadBytes, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { Auth } from '../../../context/Context';
import uuid from 'react-uuid';

import { useState, useEffect, useCallback } from 'react';

const useData = () => {
    const [data, setData] = useState([]);
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

         useEffect(() => {
            uid ? 
            (async()=>{
                await
                onValue(ref(db, 'books/users/' + uid), snapshot => {
                    const database = snapshot.val();
                    let arr = [];
                    if (database !== null) {
                        Object.values(database).map(db => {
                            arr.push(db);
                        })
                    }
                    if(arr.length !== 0)
                        setData(arr)
                        setLoading(false)
                })
            }) () 
            :
            (async()=>{
                await
                onValue(ref(db, 'books/public/'), snapshot => {
                    const database = snapshot.val();
                    let arr = [];
                    if (database !== null) {
                        Object.values(database).map(db => {
                            arr.push(db);
                        })
                    }
                    if(arr.length !== 0)
                        setData(arr)
                        setLoading(false)
                })
            }) () 
            //eslint-disable-next-line
        }, [render])

        if(data.length >= 1 ){
            if(data[0].id)
                return data
            else {
                return Object.values(data[0])}
        }
    } //end method 



    function LoginData(){
    useCallback(()=>{
        if(uid){
               (async()=>{
                await
                onValue(ref(db, 'books/public/'), snapshot => {
                    const database = snapshot.val();
                    if (database !== null) {
                        Object.values(database).map(data => {
                           (async()=>{
                                await
                                set(ref(db,`books/users/${uid}/${data.id}`),data)
                           })()
                        })
                    }
                })
                })()
            }
        // eslint-disable-next-line
        },[])
}

    function UpdateData(newData) {
        if (uid !== '' && newData.id) {
            update(ref(db, 'books/users/' + uid + '/' + newData.id), newData)
                .then(setRender(!render))
        }
    }


    function DeleteData(item) {
        console.log(item.id)
        remove(ref(db, 'books/users/' + uid + '/' + item.id))
            .then(() => setRender(!render))
            .catch(err => console.log(err));
    }

    return { WriteData, ReadData, UpdateData, DeleteData, LoginData, loading };
}
export default useData;