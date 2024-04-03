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
