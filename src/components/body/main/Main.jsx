import './Main.scss';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsFillStarFill } from 'react-icons/bs';
import { GiSevenPointedStar } from 'react-icons/gi';
import { MdLocationOn } from 'react-icons/md';
import Cards from '../../card/Cards';
import { Link } from 'react-router-dom';
import { Auth } from '../../../context/Context';

const Main = ()=>{
    const { userData } = Auth();
    const { user } = userData;
    return(
        <div className="containerMain">
            <div className="recommended">
                <div className="text">
                    <p>Recommended by our librarians</p>
                    <p>View More</p>
                </div>
                <div className="cards">
                    <Cards/>
                </div>
            </div>
            
            <div className="more">
                <div className="login">
                {
                    user === '' 
                    ? 
                    <Link to={'/login'}>Log In</Link>
                    :
                    <Link to={'/logout'}>Log Out</Link>
                }
                </div>
                <div className="search">
                <input type="text" placeholder='Search'/>
                <AiOutlineSearch/>
                </div>
                <div className="news">
                    <h3><BsFillStarFill/> New &#38; Notable </h3>
                    {user !== '' && <Link to={'/addBook'}>Add book</Link>}
                    <p>New titles</p>
                    <p>Award Winners</p>
                    <p>Bestellers</p>
                </div>
                <div className="collections">
                    <h3><GiSevenPointedStar/> Collections</h3>
                    <p>Books</p>
                    <p>E-books &#38;Audiobooks</p>
                    <p>Movies</p>
                    <p>Music &#38;Recordings</p>
                    <p>Periodicals</p>
                    <p>Images</p>
                    <p>Braile &#38;Talking Books</p>
                </div>
                <div className="location">
                    <h3> <MdLocationOn/> Location</h3>
                    <p>8091 Santa Monica, Los Angeles, California</p>
                </div>
            </div>
        </div>
    )
}
export default Main;