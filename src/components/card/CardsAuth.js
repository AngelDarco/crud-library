import { addDoc, collection } from "firebase/firestore"; 
import { getStorage, ref, getDownloadURL, listAll } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { db } from '../../fbConfig/firebase-config';

const CardsAuth = ()=>{
  const [ data, setData ] = useState(); 
  const [ loading, setLoading ] = useState(true); 

  useEffect(()=>{
    const storage = getStorage();
    const imagesRef = ref(storage, 'Books');  
            let urls = []
              listAll(imagesRef)
                  .then( res => {
                    res.items.forEach((itemRef)=>{
                      getDownloadURL(ref(storage,itemRef))                  
                      .then( res => urls.push({url:res, name: itemRef.name}))
                    })
                    setData(urls)
                    data !== undefined && 
                    setLoading(false)
                  })
// eslint-disable-next-line react-hooks/exhaustive-deps
},[ loading])
  

useEffect(()=>{
  const AddData = async ()=>{
    await data.map(item => {
       const { url, name } = item;
       addDoc(collection(db, 'products'), { url:url, name: name })
      })
      }
      data !== undefined &&
      AddData()
// eslint-disable-next-line react-hooks/exhaustive-deps
},[data])

} //End main key
export default CardsAuth;