import './Cards.scss';
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState} from 'react';
import { db } from '../../fbConfig/firebase-config';
import Loading from '../assets/loading/Loading';

const Cards = ()=>{
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

    return(
      <div className="cardsContainer" onLoad={fetch}>
          {
            loading ?
            <Loading/>
            :
            data.map(res => 
              <div className="card" key={res.name}>
                <img src={res.url} alt={res.name} />
                <p>{res.name}</p>
                <p>{res.autor}</p>
              </div>
               )
              } 
        </div> 
    )
}
export default Cards;