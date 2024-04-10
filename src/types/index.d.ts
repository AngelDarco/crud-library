// firebase data structure
export type Data = {
  id: string;
  autor: string;
  name: string;
  img: string;
  imgPath: string;
  avalible: boolean;
  download: boolean;
  like: boolean;
  owner: string;
};

// context
export type UserValue = {
  uid: string;
  user: string;
  setUserData?: React.Dispatch<React.SetStateAction<UserValue>>;
};

// useData
export type WriteData = {
  autor: string;
  name: string;
  img: File;
};
