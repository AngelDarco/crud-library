import "./AddBooks.scss";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import HandlerData from "../../hooks/firebase/HandlerData";

const AddBooks = () => {
  const initialState = { autor: "", name: "", img: "" };

  const [bookData, setBookData] = useState(initialState);
  const [img, setImg] = useState("");
  const [clas, setClas] = useState(false);

  // const { uid } = useContext(context);
  // console.log(uid);
  const data = new HandlerData();

  const handlerForms = ({ name, value }) => {
    switch (name) {
      case "autor":
        setBookData({
          ...bookData,
          autor: value,
        });
        break;
      case "name":
        setBookData({
          ...bookData,
          name: value,
        });
        break;
      case "img":
        setBookData({
          ...bookData,
          img: value,
        });
        setImg(URL.createObjectURL(value));
        setClas(true);
        break;

      default:
        break;
    }
  };

  const handlerReset = () => {
    setBookData(initialState);
    setClas(false);
  };

  const handlerAdd = (e) => {
    e.preventDefault();
    let count = 0;
    Object.keys(bookData).map((item) => {
      bookData[item] === "" && count++;
    });
    if (count > 0) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please fill all the fields",
        showConfirmButton: false,
        timer: 500,
      });
    } else {
      toast
        .promise(data.WriteData(bookData), {
          pending: "Adding New Book",
          success: "Book added",
          error: "We sorry, something went wrong",
          timer: 500,
        })
        .then(() => {
          setClas(false);
          setBookData(initialState);
          count = 0;
          document.getElementById("form").reset();
        })
        .catch((err) => console.log(err));
    }
  };

  const handlerFile = (file) => {
    if (file?.target?.files[0] === undefined) return;

    if (
      file?.target?.files[0]?.type !== "image/png" &&
      file?.target?.files[0]?.type !== "image/jpeg"
    ) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Only .jpg, .png or .jpeg format are allowed",
        showConfirmButton: false,
        timer: 1800,
      });
      return;
    }
    handlerForms({ name: "img", value: file.target.files[0] });
  };

  return (
    <div className="containerAddBooks">
      <div className="form">
        <div className="img">
          <img src={img} alt="myImg" className={!clas ? "hide" : "show"} />
        </div>
        <form id="form">
          <input
            onChange={(e) => handlerFile(e)}
            type="file"
            name="img"
            id="img"
            required
          />
          <input
            onChange={(e) => handlerForms(e.target)}
            type="text"
            name="autor"
            placeholder="Autor"
            required
          />
          <input
            onChange={(e) => handlerForms(e.target)}
            type="text"
            name="name"
            placeholder="Book name"
            required
          />
          <button onClick={handlerReset} type="reset">
            reset
          </button>
          <button onClick={handlerAdd}>add</button>
        </form>
      </div>
      <ToastContainer limit={2} />
    </div>
  );
};
export default AddBooks;
