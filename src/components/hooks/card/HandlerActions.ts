import { useContext } from "react";
import { Data } from "../../../types";
import { context } from "../../../context/Context";
import Swal, { SweetAlertOptions } from "sweetalert2";
// import useDownload from "../firebase/UseDownload";
import HandlerData from "../firebase/HandlerData";

type DataKeys = "userData" | "publicData";
type StoreData = {
  [key in DataKeys]: { [key: string]: Data };
};

// useCardFunctions replacement
export default class HandlerActions {
  uid: string;
  data: HandlerData;
  constructor() {
    /*   const { userData } = useContext(context);
  const { UpdateData, DeleteData, ReadData } = useData();
  const file = useDownload();
  const { user, publics } = ReadData();

  if (!userData || !userData.uid) return null;
  const { uid } = userData; */
    // this.data = data;
    const { uid } = useContext(context);
    this.uid = uid;
    this.data = new HandlerData(this.uid);
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

  private alert(
    icon: string,
    title: string,
    timer: number,
    position = "center"
  ) {
    Swal.fire({
      position,
      icon,
      title,
      showConfirmButton: false,
      timer,
    } as SweetAlertOptions);
  }

  async handlerDownload(res: Data) {
    const file = await this.data.Download();
    if (typeof this.uid !== "string" || this.uid === "")
      return this.alert("error", "Sorry, You must log first", 1000, "center");

    if (!file || typeof file !== "string")
      return this.alert(
        "error",
        "Sorry, something went wrong internal",
        1000,
        "center"
      );

    // check if already downloaded
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
          this.alert("success", "Downloading ...", 500, "center");
          window.open(file);
        }
      });
      return;
    }

    await this.data.UpdateData({ ...res, download: true }).then((res) => {
      if (res === "done") {
        this.alert("success", "Downloaded", 200, "center");
        window.open(file);
      } else this.alert("error", res as string, 1000, "center");
    });
  }

  async HandlerLikes(data: Data) {
    if (this.uid === "") {
      this.alert("error", "Sorry, You must log first", 1000, "center");
      return;
    }

    await this.data.UpdateData({ ...data, like: !data.like });

    !data.like
      ? this.alert("success", "Like", 500, "top-right")
      : this.alert("warning", "Unlike", 500, "top-right");
  }

  HandlerDelete(itm: Data) {
    if (this.uid === "") {
      this.alert("error", "Sorry, You must log first", 1500);
      return;
    }
    this.uid === itm.owner
      ? (this.data.DeleteData(itm.id), this.alert("success", "deleted", 1000))
      : this.alert("warning", "You just can delete your books", 1500);
  }
}
