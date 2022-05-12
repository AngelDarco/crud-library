import './Header.scss';
import { Link } from "react-router-dom";
import { BsFillBookmarkFill } from 'react-icons/bs'
import { Auth } from '../../../context/Context';

const Header = ()=>{
    const { userData } = Auth()
    const { user } = userData;
    const userName = user.split('@')

    return(
        <div className="containerHeader">
            <div className="title">
                <span><BsFillBookmarkFill className='bookmark'/></span>
                <h1>Public Library</h1>
            </div>
            <div className="navbar">
                <ul>
                    <Link to={'/'}>Home</Link>
                    <Link to={'/about'}>About</Link>
                    <Link to={'/books'}>Books</Link>
                    <Link to={'/events'}>Events</Link>
                    <Link to={'/contacts'}>Contacts</Link>
                </ul>
            </div>
            <div className="login">
                <p>{userName[0]}</p>
                <button>Donate</button>
            </div>
        </div>
    )
    
}
export default Header;