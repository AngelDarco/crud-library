import './AddBooks.scss';
import { useState } from 'react';
import useData from '../../hooks/firebase/useData';

const AddBooks = ()=> {
    const [bookData, setBookData] = useState({});
    const { WriteData } = useData()
    const handlerForms = (txt)=>{
        let input = txt.target.name;
        let text = txt.target.value;
            switch (input) {
                case 'autor':
                    setBookData({
                        ...bookData,
                        autor: text
                    })
                    break;
                case 'name':
                    setBookData({
                        ...bookData,
                        name: text
                    })
                    break;
                case 'img':
                    setBookData({
                        ...bookData,
                        img: text
                    })
                    break
                    
                    default:
                        break;
                    }
    }

    const handlerReset = ()=>{
        setBookData({});
    }

    const handlerAdd = (e)=>{
        e.preventDefault();
        console.log(bookData)
        Object.values(bookData).length !== 0 ? WriteData(bookData)
        : ''
    }


    return(
        <div className="containerAddBooks">
            <div className="form">
                <form >
                <input onChange={(e)=> handlerForms(e)} type="text" name="autor" placeholder='Autor' />
                <input onChange={(e)=> handlerForms(e)} type="text" name="name" placeholder='Book name'/>
                <input onChange={(e)=> handlerForms(e)} type="text" name="img" placeholder='Img link'/>
                <button onClick={handlerReset} type="reset">reset</button>           
                <button onClick={handlerAdd}>add</button>
                </form>
            </div>           
        </div>
    )
}
export default AddBooks;