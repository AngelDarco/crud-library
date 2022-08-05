import './AddBooks.scss';
import { useState } from 'react';
import useData from '../../hooks/firebase/useData';
import Swal from 'sweetalert2';

const AddBooks = ()=> {
    const { WriteData, UploadImg } = useData()
    const [bookData, setBookData] = useState({});
    const [ img, setImg ] = useState('');
    const [ clas, setClas ] = useState(false);

    
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
        Object.values(bookData) !== undefined ? WriteData(bookData)
        : Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Please fill the fields',
            showConfirmButton: false,
            timer: 1000
        })
    }
    
    const handlerFile = (file)=> {
        if(file?.target?.files[0] === undefined)  return
        
        if(file?.target?.files[0]?.type !== 'image/png' && file?.target?.files[0]?.type !== 'image/jpeg') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Only .jpg, .png or .jpeg format are allowed',
                showConfirmButton: false,
                timer: 1800
            })
            return
        }
        
        const url = UploadImg(file?.target?.files[0])
        setImg(url)
        console.log(url)
        // setImg(file.target?.files[0])
        setClas(true)
        console.log(clas)
    }   
    console.log(img)
    return(
        <div className="containerAddBooks">
            <div className="form">
                <div className="img">
                    <img src={img} alt="myImg" className={!clas ? 'hide' : 'show'}/>
                </div>
                <form>
                    <input onChange={(e)=> handlerFile(e)} type="file" name="img" id="img" required />
                    <input onChange={(e)=> handlerForms(e)} type="text" name="autor" placeholder='Autor' required/>
                    <input onChange={(e)=> handlerForms(e)} type="text" name="name" placeholder='Book name' required/>
                    <input onChange={(e)=> handlerForms(e)} type="text" name="img" placeholder='Img link' required/>
                    <button onClick={handlerReset} type="reset">reset</button>           
                    <button onClick={handlerAdd}>add</button>
                </form>
            </div>           
        </div>
    )
}
export default AddBooks;