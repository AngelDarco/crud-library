import { getDatabase, ref, set, onValue, update } from 'firebase/database';
import { getStorage, uploadBytes, ref as storageRef, getDownloadURL} from 'firebase/storage';
import { Auth } from '../../../context/Context';
import uuid from 'react-uuid';

import { useState, useEffect } from 'react';

const useData = ()=>{
const [ loading, setLoading ] = useState(true);

const db = getDatabase();
const {userData} = Auth();
const { uid } = userData;

function WriteData({autor,name,img}){
    if(!autor || !name || !img) return
    const loadImg = ()=>{
        const storage = getStorage();
        const refImg =  storageRef(storage,'Books/'+uuid()+img.name);
                  
        return new Promise((resolve,reject) =>
                    uploadBytes(refImg,img)
                    .then(snapshot => {
                        getDownloadURL(storageRef(storage, snapshot.metadata.fullPath))
                        .then( link => {
                            resolve(link)
                        });
                    })
                    .catch(err => reject(err.message))
                )
            }
        
        return new Promise( (resolve,reject) =>
        loadImg()
            .then(res => {
                     set(ref(db,'books/'+uid+'/'+uuid()),{
                        id: uuid(),
                        autor,
                        name,
                        img:res,
                        avalible: true,
                        download: false,
                        like: false
                    })
                    .then(()=>{
                        resolve()
                    })               
                })
                .catch( err => reject(err.message))
            )
}

function ReadData(id='public'){
    const [ data, setData ] = useState([]);
            useEffect(()=>{
                onValue(ref(db, 'books/' + id), snapshot => {
                    setData([]);
                    const database = snapshot.val();
                    if (database !== null) {
                        Object.values(database).map(db => {
                            setData(oldData => [...oldData, db]);
                        });
                        setLoading(false);
                    }
                })
                return ()=> setLoading(true)
            },[id])
    return data;
}

function UpdateData({id,like,avalible,download}){
    const newData = {
        like,
        avalible,
        download
    }
    if(uid !== '' && id )
        update(ref(db,'books/'+uid+'/'+id),newData)
}

    return { WriteData, ReadData, UpdateData, loading };
}
export default useData;