import {
  Database,
  getDatabase,
  set,
  ref,
  onValue,
  update,
  remove,
  DatabaseReference,
  // DataSnapshot,
} from "firebase/database";
import { ref as storageRef } from "firebase/storage";
import { Data, WriteData } from "../types";
import uuid from "react-uuid";
import { getDownloadURL, getStorage, uploadBytes } from "firebase/storage";

// type FirebaseData = {
//   usersData?: DataSnapshot;
//   publicData?: DataSnapshot;
// };

export default class HandlerData {
  db: Database;
  uid: string;
  private publicRef: DatabaseReference;
  private usersRef: DatabaseReference;

  constructor(uid: string) {
    this.db = getDatabase();
    this.uid = uid;
    this.publicRef = ref(this.db, "books/public/");
    this.usersRef = ref(this.db, "books/users/");
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
          Object.values(snapshot.val()).map((data) => {
            publicData = { ...publicData, ...(data as Data) };
          });

          // call current user
          getCurrentUser();
        });
      };

      // get public data
      onValue(this.publicRef, (snapshot) => {
        publicData = { ...snapshot.val() };

        // call users data
        getUsersData();
      });
    });
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
