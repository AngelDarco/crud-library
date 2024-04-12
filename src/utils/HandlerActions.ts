import { Data } from "../types";
import Swal, { SweetAlertOptions } from "sweetalert2";
import HandlerData from "./HandlerData";

type DataKeys = "userData" | "publicData";
type StoreData = {
  [key in DataKeys]: { [key: string]: Data };
};

export default class HandlerActions {
  uid: string;
  name: string;
  data: HandlerData;
  constructor(uid: string, name: string) {
    this.uid = uid;
    this.name = name;
    this.data = new HandlerData(this.uid);
  }

  async handlerAllData(data: StoreData) {
    const arr = new Set();
    const allData = await Promise.resolve(data);
    if (allData)
      if (allData.publicData)
        Object.values(allData.publicData).forEach((value) => {
          if (allData.userData)
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
    if (this.name === "guest") {
      this.alert("error", "Sorry, You must log first", 1000, "center");
      return;
    }

    await this.data.UpdateData({ ...data, like: !data.like });

    !data.like
      ? this.alert("success", "Like", 500, "top-right")
      : this.alert("warning", "Unlike", 500, "top-right");
  }

  async HandlerDelete(itm: Data) {
    if (
      this.uid === itm.owner ||
      this.uid === import.meta.env.VITE_SUPER_USER
    ) {
      await this.data
        .DeleteData(itm)
        .then(() => this.alert("success", "deleted", 1000))
        .catch((err) => this.alert("error", err, 1500));
    } else this.alert("warning", "You just can delete your books", 1500);
  }
}
