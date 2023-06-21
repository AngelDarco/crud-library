import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useEffect, useState } from 'react';

const useDownload = ()=>{
    const storage = getStorage();
    const fileRef = ref(storage,'Pdf/DarcoResume.pdf');
    const [ url, setUrl ] = useState('');

    useEffect(()=>{
           getDownloadURL(ref(storage,fileRef))
        .then( url => {
            setUrl(url)
        })
        .catch( err => {
            console.log(err)
        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return url;                          
}
export default useDownload;