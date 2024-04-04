import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  remove,
  get,
} from "firebase/database";
import {
  getStorage,
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import { context } from "../../../context/Context";
import uuid from "react-uuid";

import { useState, useEffect, useCallback, useContext } from "react";
import { UserValue, WriteData } from "../../../types";

const useData = () => {
  const [render, setRender] = useState(false);
  const db = getDatabase();
  const { uid } = useContext(context);
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

  // Read the stored books data from firebase
  async function ReadData() {
    try {
      const publicSnapshot = await get(ref(db, "books/public/"));
      const publicData = publicSnapshot.val();

      const userSnapshot = await get(ref(db, "books/users/" + uid));
      const userData = userSnapshot.val();

      return { publics: publicData, user: userData };
    } catch (error) {
      console.error("Error reading data:", error);
      throw error;
    }
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
