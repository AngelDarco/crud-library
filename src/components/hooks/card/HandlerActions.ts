import { useContext } from "react";
import { Data, UserValue } from "../../../types";
import { context } from "../../../context/Context";

type DataKeys = "userData" | "publicData";
type StoreData = {
  [key in DataKeys]: { [key: string]: Data };
};
export default class HandlerActions {
  constructor() {
    /*   const { userData } = useContext(context);
  const { UpdateData, DeleteData, ReadData } = useData();
  const file = useDownload();
  const { user, publics } = ReadData();

  if (!userData || !userData.uid) return null;
  const { uid } = userData; */
    // this.data = data;
  }

  async handlerAllData(data: StoreData) {
    const arr = new Set();
    const allData = await Promise.resolve(data);

    Object.values(allData.publicData).forEach((value) => {
      Object.values(allData.userData).forEach((value2) => {
        if (value2.id === value.id) {
          arr.add(value);
        }
      });
      arr.add(value);
    });

    return arr;
  }
}

/* import useData from "../firebase/useData";
import { context } from "../../../context/Context";
import useDownload from "../firebase/UseDownload";
import Swal from "sweetalert2";
import { useState, useEffect, useContext } from "react";

const useCardFunctions = () => {
  const { userData } = useContext(context);
  const { UpdateData, DeleteData, ReadData } = useData();
  const file = useDownload();
  const { user, publics } = ReadData();

  if (!userData || !userData.uid) return null;
  const { uid } = userData;

  const alert = (
    icon: string,
    title: string,
    timer: number,
    position = "center"
  ) => {
    Swal.fire({
      position,
      icon,
      title,
      showConfirmButton: false,
      timer,
    });
  };

  const handlerDownload = (res) => {
    if (!file) return;
    if (uid === "") {
      alert("error", "Sorry, You must log first", 1000, "center");
      return;
    }

    if (res.download) {
      Swal.fire({
        title: "Want download again?",
        text: "You want download this file again!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Download",
      }).then((result) => {
        if (result.isConfirmed) {
          alert("success", "Downloading ...", 500, "center");
          window.location.href = file;
        }
      });
      return;
    }
    window.location.href = file;
    UpdateData({
      ...res,
      download: true,
      avalible: false,
    });
  };

  const HandlerLikes = (res) => {
    if (uid === "") {
      alert("error", "Sorry, You must log first", 1000, "center", true);
      return;
    }
    !res.like && alert("success", "Like", 500, "top-right");
    UpdateData({ ...res, like: !res.like });
  };

  const handlerDelete = (itm) => {
    if (uid === "") {
      alert("error", "Sorry, You must log first", 1500);
      return;
    }
    itm.owner === uid
      ? (DeleteData(itm, true), alert("success", "deleted", 1000))
      : alert("warning", "You just can delete your books", 1500);
  };

  return { HandlerLikes, handlerDownload, handlerDelete, HandlerData };
};
export default useCardFunctions;
 */
