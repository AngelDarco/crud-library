import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  remove,
} from "firebase/database";
import {
  getStorage,
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import { Auth } from "../../../context/Context";
import uuid from "react-uuid";

import { useState, useEffect, useCallback } from "react";
import { UserValue, WriteData } from "../../../types";

const useData = () => {
  const [render, setRender] = useState(false);
  const db = getDatabase();
  const { uid } = Auth();

  function WriteData({ autor, name, img }: WriteData) {
    if (!autor || !name || !img) throw new Error("All fields are required");
    const key = uuid();
    const loadImg = () => {
      const storage = getStorage();
      const refImg = storageRef(storage, "Books/" + key + img.name);
      return new Promise((resolve, reject) =>
        uploadBytes(refImg, img)
          .then((snapshot) => {
            getDownloadURL(
              storageRef(storage, snapshot.metadata.fullPath)
            ).then((link) => {
              resolve(link);
            });
          })
          .catch((err) => reject(err.message))
      );
    };

    return new Promise((resolve, reject) =>
      loadImg()
        .then((res) => {
          set(ref(db, "books/public/" + key), {
            id: key,
            autor,
            name,
            img: res,
            avalible: true,
            download: false,
            like: false,
            owner: uid,
          })
            .then(() => resolve("done"))
            .catch((err) => reject(new Error(err.message)));
        })
        .catch((err) => reject(new Error(err.message)))
    );
  }

  function ReadData() {
    const [user, setUser] = useState([]);
    const [publics, setPublics] = useState([]);

    const pub = () => {
      return new Promise((resolve) => {
        onValue(ref(db, "books/public/"), (snapshot) => {
          const database = snapshot.val();
          let arr: any[] = [];
          if (database !== null) {
            Object.values(database).map((db) => {
              arr.push(db);
            });
            resolve(arr);
          } else resolve([]);
        });
      });
    };

    const usr = () => {
      if (!uid) return new Promise((res) => res([]));
      return new Promise((resolve) => {
        onValue(ref(db, "books/users/" + uid), (snapshot) => {
          const database = snapshot.val();
          let arr: any[] = [];
          if (database !== null) {
            Object.values(database).map((db) => {
              arr.push(db);
            });
            resolve(arr);
          } else resolve([]);
        });
      });
    };

    useEffect(() => {
      (async () => {
        await usr().then((res) => setUser(res));
        await pub().then((res) => setPublics(res));
      })();
      //eslint-disable-next-line
    }, [render]);

    return { user, publics };
  }

  function LoginData() {
    useCallback(() => {
      if (uid) {
        (async () => {
          await onValue(ref(db, "books/public/"), (snapshot) => {
            const database = snapshot.val();
            if (database !== null) {
              Object.values(database).map((data) => {
                (async () => {
                  await set(ref(db, `books/users/${uid}/${data.id}`), data);
                })();
              });
            }
          });
        })();
      }
      // eslint-disable-next-line
    }, []);
  }

  function UpdateData(newData: UserValue) {
    if (uid !== "" && newData.uid) {
      update(ref(db, "books/users/" + uid + "/" + newData.uid), newData).then(
        setRender(!render)
      );
    }
  }

  function DeleteData(item: UserValue, pub = false) {
    remove(ref(db, "books/users/" + uid + "/" + item.uid))
      .then(() => setRender(!render))
      .catch((err) => console.log(err));
    if (pub)
      remove(ref(db, "books/public/" + item.uid))
        .then(() => setRender(!render))
        .catch((err) => console.log(err));
  }

  return { WriteData, ReadData, UpdateData, DeleteData, LoginData };
};
export default useData;
