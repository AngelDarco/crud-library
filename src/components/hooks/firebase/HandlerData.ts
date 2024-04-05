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

export default class HandlerData {
  db: Database;
  uid: string;

  constructor(uid: string) {
    this.db = getDatabase();
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
      const refImg = storageRef(storage, "Books/" + key + img.name);
      await uploadBytes(refImg, img)
        .then((snapshot) => {
          getDownloadURL(storageRef(storage, snapshot.metadata.fullPath)).then(
            (link) => {
              return link;
            }
          );
        })
        .catch((err) => {
          console.log(err);
          return `${err.message}`;
        });
    };

    return new Promise((resolve, reject) =>
      loadImg()
        .then((res) =>
          set(ref(this.db, `books/public/${key}`), {
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
            .catch((err) => reject(new Error(err.message)))
        )
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
    return new Error("Something went wrong downloading the file");
  }

  async DeleteData(item: UserValue, pub = false) {
    let res = "";
    await remove(ref(this.db, "books/users/" + this.uid + "/" + item.uid))
      .then(() => (res = "done"))
      .catch((err) => console.log(err));
    if (pub)
      await remove(ref(this.db, "books/public/" + item.uid))
        .then(() => (res = "done"))
        .catch((err) => console.log(err));
    return res;
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
