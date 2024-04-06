import {
  Database,
  get,
  getDatabase,
  set,
  ref,
  onValue,
  update,
  remove,
} from "firebase/database";
import { ref as storageRef } from "firebase/storage";
import { Data, UserValue, WriteData } from "../../../types";
import uuid from "react-uuid";
import { getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import { useContext } from "react";
import { context } from "../../../context/Context";

export default class HandlerData {
  db: Database;
  uid: string;

  constructor() {
    this.db = getDatabase();
    const { uid } = useContext(context);
    this.uid = uid;
  }
  // Read the stored books data from firebase
  async ReadData() {
    try {
      const publicSnapshot = await get(ref(this.db, "books/public/"));
      const usersSnapshots = await get(ref(this.db, "books/users/"));

      let usersData = {};
      Object.values(usersSnapshots.val() as Record<string, UserValue>).forEach(
        (users) => {
          usersData = { ...usersData, ...users };
        }
      );

      const allData = { ...publicSnapshot.val(), ...usersData };

      const userSnapshot = await get(ref(this.db, "books/users/" + this.uid));
      const userData = userSnapshot.val();

      return { publicData: allData, userData };
    } catch (error) {
      console.error("Error reading data:", error);
      throw error;
    }
  }

  async WriteData({ autor, name, img }: WriteData) {
    if (!autor || !name || !img) throw new Error("All fields are required");
    const key = uuid();
    const loadImg = async () => {
      const storage = getStorage();
      const refImg = storageRef(storage, `books/${key}${img.name}`);
      return await uploadBytes(refImg, img)
        .then(async (snapshot) => {
          const link = await getDownloadURL(
            storageRef(storage, snapshot.metadata.fullPath)
          );
          return link;
        })
        .catch((err) => {
          console.log(err);
          return `${err.message}`;
        });
    };

    return new Promise((resolve, reject) =>
      loadImg()
        .then((res) => {
          const path = this.uid
            ? `books/users/${this.uid}/${key}`
            : `books/public/${key}`;

          set(ref(this.db, path), {
            id: key,
            autor,
            name,
            img: res,
            avalible: true,
            download: false,
            like: false,
            owner: this.uid,
          })
            .then(() => resolve("done"))
            .catch((err) => reject(new Error(err.message)));
        })
        .catch((err) => reject(new Error(err.message)))
    );
  }

  async LoginData() {
    let res = "";
    if (this.uid) {
      onValue(ref(this.db, "books/public/"), (snapshot) => {
        const database = snapshot.val();
        if (database !== null) {
          Object.values(database as Record<string, Data>).map((data) => {
            (async () => {
              await set(
                ref(this.db, `books/users/${this.uid}/${data.id}`),
                data
              )
                .then(() => (res = "done"))
                .catch((err) => console.log(err));
            })();
          });
        }
      });
    }
    return res;
  }

  async UpdateData(newData: Data) {
    if (this.uid !== "" && newData.id) {
      return await update(
        ref(this.db, "books/users/" + this.uid + "/" + newData.id),
        newData
      )
        .then(() => "done")
        .catch((err) => {
          console.error(err);
          throw new Error(err.message);
        });
    }
    return new Error("Something went wrong updating the data");
  }

  async DeleteData(bookId: string, admin = false) {
    // admin can delete all books
    if (admin)
      await remove(ref(this.db, "books/public/" + bookId))
        .then(() => "done")
        .catch((err) => console.log(err));

    return await remove(ref(this.db, "books/users/" + this.uid + "/" + bookId))
      .then(() => "done")
      .catch((err) => {
        console.error(err);
        throw new Error(err);
      });
  }

  async Download() {
    let url = "";
    const storage = getStorage();
    // const fileRef = storageRef(storage, "Pdf/DarcoResume.pdf");

    await getDownloadURL(storageRef(storage, "documents/AGPresume.pdf"))
      .then((link) => {
        url = link;
      })
      .catch((err) => {
        console.error(err);
        throw new Error(err.message);
      });
    return url;
  }
}
