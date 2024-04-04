import "./Header.scss";
import { Link } from "react-router-dom";
import { BsFillBookmarkFill } from "react-icons/bs";
import { context } from "../../../context/Context";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgCloseO } from "react-icons/cg";
import { useContext, useState } from "react";

const Header = () => {
  const { userData } = useContext(context);
  const [menu, setMenu] = useState(true);

  if (!userData || !userData.uid || !userData.user) return null;

  const { user } = userData;
  const userName = user.split("@")[0];

  return (
    <div
      className="containerHeader"
      style={!menu ? { position: "static" } : { position: "relative" }}
    >
      <div className="title">
        <span>
          <BsFillBookmarkFill className="bookmark" />
        </span>
        <Link to={"/"}>
          {" "}
          <h1>Public Library </h1>
        </Link>
      </div>
      <div className={!menu ? "navbar active" : "navbar"}>
        <ul className={menu ? "hide" : ""}>
          <Link to={"/"}>Home</Link>
          <Link to={"/addBook"}>Add Book</Link>
          {!user && <Link to={"/register"}>Register</Link>}
          {!user ? (
            <Link className="session" to={"/login"}>
              Log In
            </Link>
          ) : (
            <Link className="session" to={"/logout"}>
              Log Out
            </Link>
          )}
        </ul>
        <div onClick={() => setMenu(!menu)} className="menu">
          {menu ? (
            <GiHamburgerMenu onClick={() => setMenu(!menu)} />
          ) : (
            <CgCloseO />
          )}
        </div>
      </div>
      <div className="donate">
        <p>
          {" "}
          <span>¡Hi:</span> {userName ? userName : " Guest"}
        </p>
        <button>Donate</button>
      </div>
    </div>
  );
};
export default Header;
