import { getDatabase, ref, set, onValue, update } from 'firebase/database';
import { Auth } from '../../../context/Context';
import uuid from 'react-uuid';

import { useEffect, useState } from 'react';

const useData = ()=>{

const db = getDatabase();
const {userData} = Auth();
const { uid } = userData;

function WriteData({autor,name,img}){
    const key = uuid()
    set(ref(db,'books/'+uid+'/'+key),{
        id: key,
        autor,
        name,
        img,
        avalible: true,
        download: false,
        like: false
    })
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
                }
            })
    },[id]);
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

    return { WriteData, ReadData, UpdateData };
}
export default useData;