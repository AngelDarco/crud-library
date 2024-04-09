import "./AddBooks.scss";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useRef, useState } from "react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import HandlerData from "../../../utils/HandlerData";
import { context } from "../../../context/Context";

const AddBooks = () => {
  const [img, setImg] = useState();
  const { uid } = useContext(context);

  const data = new HandlerData(uid);
  let formData = useRef({});
  const FORM_FIELDS = 3;

  const handlerForms = (e) => {
    if (!e.target) {
      setImg(URL.createObjectURL(e.value));
      return (formData.current[e.name] = e.value);
    }
    const { name, value } = e.target;
    formData.current[name] = value;
  };

  const handlerReset = () => {
    setImg();
  };

  const handlerAdd = (e) => {
    e.preventDefault();
    if (Object.values(formData.current).length < FORM_FIELDS)
      return Swal.fire({
        position: "center",
        icon: "error",
        title: "Please fill all the fields",
        showConfirmButton: false,
        timer: 800,
      });

    toast
      .promise(data.WriteData(formData.current), {
        pending: "Adding New Book",
        success: "Book added",
        error: "We sorry, something went wrong",
        timer: 500,
      })
      .then(() => {
        formData = {};
        setImg();
        document.getElementById("form").reset();
      })
      .catch((err) => console.log(err));
  };

  const handlerFile = (file) => {
    const img = file?.target?.files[0];
    if (img === undefined) return;

    if (
      img?.type !== "image/png" &&
      img?.type !== "image/jpg" &&
      img?.type !== "image/jpeg"
    )
      return Swal.fire({
        position: "center",
        icon: "error",
        title: "Only .jpg, .png or .jpeg format are allowed",
        showConfirmButton: false,
        timer: 1800,
      });
    handlerForms({ name: "img", value: img });
  };

  return (
    <div className="containerAddBooks">
      <div className="form">
        <div className="img">
          <img src={img} alt="myImg" className={!img ? "hide" : "show"} />
        </div>
        <form id="form">
          <input
            onChange={handlerFile}
            type="file"
            name="img"
            id="img"
            required
          />
          <input
            onKeyUp={handlerForms}
            type="text"
            name="autor"
            placeholder="Autor"
            required
          />
          <input
            onKeyUp={handlerForms}
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
