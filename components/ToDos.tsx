"use client";
import { db } from "@/firebase/clientApp";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import moment from "moment";

type Item = {
  id: string;
  title: string;
  text: string;
  date: Object;
};

async function fetchDataDocs() {
  const querySnap = await getDocs(collection(db, "todos"));

  const data: any = [];
  querySnap.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });

  return data;
}

export default function ToDos() {
  const [values, setValues] = useState({
    text: "",
    title: "",
  });
  const [userData, setUserData] = useState([]);

  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(db, "todos", id));
      console.log("Deleted", id);
      location.reload();
    } catch (error) {
      console.log("Deletion error", error);
    }
  }

  async function handleUpdate(id: string) {
    const docRef = doc(db, "todos", id);
    await updateDoc(docRef, {
      title: values.title,
      text: values.text,
    });
    console.log("Update successfull");
  }

  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataDocs();
      console.log(data);
      setUserData(data);
    }

    fetchData();
  }, []);

  return (
    <div className="w-[400px] h-[300px] overflow-scroll flex flex-col gap-4 items-start mt-10 trans p-4">
      {userData.map((item: Item) => (
        <div
          key={item.id}
          className="flex flex-col gap-1 w-[365px] h-auto max-w-[365px] trans p-2"
        >
          <h3 className="text-xl uppercase">{item.title}</h3>
          <h3 className=" text-xs text-gray-300">
            {/*@ts-ignore */}
            Due: {new Date(item.date.seconds * 1000).toLocaleDateString("en-US")}
          </h3>
          <h3 className=" font-thin mt-2 ">{item.text}</h3>
          <div className="flex w-full justify-between mt-2">
            <Dialog>
              <DialogTrigger className="bg-orange-500 p-2 rounded-xl">
                Update
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>Update an to-do</DialogHeader>
                <form className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={values.title === "" ? item.title : values.title}
                    name="title"
                    placeholder="Change title..."
                    required
                    onChange={(e) =>
                      setValues({
                        ...values,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    value={values.text === "" ? item.text : values.text}
                    name="text"
                    placeholder="Change text..."
                    required
                    onChange={(e) =>
                      setValues({
                        ...values,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Button onClick={() => handleUpdate(item.id)}>
                    Submit Changes
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <button
              type="button"
              className="bg-red-600 p-2 rounded-xl text-white"
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
