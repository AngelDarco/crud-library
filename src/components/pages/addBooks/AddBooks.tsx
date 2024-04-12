import "./AddBooks.scss";
import "react-toastify/dist/ReactToastify.css";
import { ChangeEvent, FormEvent, useContext, useRef, useState } from "react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import HandlerData from "../../../utils/HandlerData";
import { context } from "../../../context/Context";

type InitialState = {
  [key: string]: string | File;
};

const AddBooks = () => {
  const [img, setImg] = useState("");
  const { uid } = useContext(context);
  const formData = useRef<InitialState | null>({});

  const data = new HandlerData(uid);

  const FORM_FIELDS = 3;

  const handlerForms = (e: FormEvent<HTMLInputElement>) => {
    if (!formData.current) return;

    const { name, value } = e.target as HTMLInputElement;
    formData.current[name] = value;
  };

  const handlerReset = () => {
    setImg("");
  };

  const handlerAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.current) return;

    if (Object.values(formData.current).length < FORM_FIELDS)
      return Swal.fire({
        position: "center",
        icon: "error",
        title: "Please fill all the fields",
        showConfirmButton: false,
        timer: 800,
      });

    toast
      .promise(
        data.WriteData(
          formData.current as { autor: string; name: string; img: File }
        ),
        {
          pending: "Adding New Book",
          success: "Book added",
          error: "We sorry, something went wrong",
        },
        {
          autoClose: 500,
        }
      )
      .then(() => {
        formData.current = null;
        setImg("");
        const form = document.getElementById("form");
        if (form) (form as HTMLFormElement).reset();
      })
      .catch((err) => console.log(err));
  };

  const handlerFile = (file: ChangeEvent<HTMLInputElement>) => {
    if (!file?.target?.files) return;
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
    setImg(URL.createObjectURL(img));
    if (formData.current) {
      return (formData.current["img"] = img);
    }
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
