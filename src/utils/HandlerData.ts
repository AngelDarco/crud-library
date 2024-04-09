import {
  Database,
  getDatabase,
  set,
  ref,
  onValue,
  update,
  remove,
  DatabaseReference,
} from "firebase/database";

import {
  FirebaseStorage,
  deleteObject,
  ref as storageRef,
} from "firebase/storage";
import { Data, WriteData } from "../types";
import uuid from "react-uuid";
import { getDownloadURL, getStorage, uploadBytes } from "firebase/storage";

export default class HandlerData {
  db: Database;
  uid: string;
  downloadPath: string;
  private publicRef: DatabaseReference;
  private usersRef: DatabaseReference;
  storage: FirebaseStorage;

  constructor(uid: string) {
    this.db = getDatabase();
    this.uid = uid;
    this.downloadPath = "documents/AGPresume.pdf";
    this.publicRef = ref(this.db, "books/public/");
    this.usersRef = ref(this.db, "books/users/");
    this.storage = getStorage();
  }

  async ReadData() {
    return new Promise((resolve) => {
      let publicData = {},
        userData = {};

      // get current user
      const getCurrentUser = () => {
        onValue(ref(this.db, `/books/users/${this.uid}`), (snapshot) => {
          userData = { ...snapshot.val() };
          resolve({ publicData, userData });
        });
      };
      // get users data
      const getUsersData = () => {
        onValue(this.usersRef, (snapshot) => {
          if (snapshot.exists())
            Object.values(snapshot.val()).map((data) => {
              publicData = { ...publicData, ...(data as Data) };
            });

          // call current user
          getCurrentUser();
        });
      };

      // get public data
      onValue(this.publicRef, (snapshot) => {
        if (snapshot.exists()) publicData = { ...snapshot.val() };

        // call users data
        getUsersData();
      });
    });
  }

  async WriteData({ autor, name, img }: WriteData) {
    if (!autor || !name || !img) throw new Error("All fields are required");
    const key = uuid();
    const imgPath = `books/users/${this.uid}/${key}`;
    const imgName = `books/${key}${img.name}`;

    const loadImg = async () => {
      const refImg = storageRef(this.storage, `books/${key}${img.name}`);
      return await uploadBytes(refImg, img)
        .then(async (snapshot) => {
          const link = await getDownloadURL(
            storageRef(this.storage, snapshot.metadata.fullPath)
          );
          return link;
        })
        .catch((err) => {
          throw new Error(err.message);
        });
    };

    return new Promise((resolve, reject) =>
      loadImg()
        .then((res) => {
          const path = this.uid ? imgPath : `books/public/${key}`;

          set(ref(this.db, path), {
            id: key,
            autor,
            name,
            imgName,
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
      onValue(ref(this.db, "books/public/"), async (snapshot) => {
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

  async DeleteData(bookId: string, imgName: string, admin = false) {
    // admin can delete all books
    if (admin)
      await remove(ref(this.db, "books/public/" + bookId))
        .then(async () => {
          await this.cleanStorage(imgName);
        })
        .catch((err) => console.log(err));

    return await remove(ref(this.db, "books/users/" + this.uid + "/" + bookId))
      .then(async () => {
        await this.cleanStorage(imgName);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  async Download() {
    let url = "";

    await getDownloadURL(storageRef(this.storage, this.downloadPath))
      .then((link) => {
        url = link;
      })
      .catch((err) => {
        console.error(err);
        throw new Error(err.message);
      });
    return url;
  }

  private async cleanStorage(imgName: string) {
    const refImg = storageRef(this.storage, `${imgName}`);
    return deleteObject(refImg).catch((err) => new Error(err.message));
  }
}
