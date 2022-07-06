import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState} from 'react';
import { db } from '../../fbConfig/firebase-config';

const useData = () =>{
    const [data, setData ] = useState('');
    const [loading, setLoading ] = useState(true);


useEffect(()=>{
  data === "" &&
  (async ()=>{
    const img = []; 
    const arr = await getDocs(collection(db,'products'));
    arr.forEach(doc => img.push(doc.data()))
    setData(...data,img)
    setLoading(false)
  })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
},[])
    return { data, loading }
}
export default useData;