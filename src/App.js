import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import "./App.css";

function App() {
  //keep and update state
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");
  const queryAtts = query(usersCollectionRef);

  const updateUserInc = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = { age: age + 1 };
    await updateDoc(userDoc, newFields);
  };

  const updateUserDec = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = { age: age - 1 };
    await updateDoc(userDoc, newFields);
  };

  const createUser = async () => {
    await addDoc(usersCollectionRef, { name: newName, age: Number(newAge) });
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };

  useEffect(() => {
    onSnapshot(queryAtts, (snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      );
    });
  }, []);

  return (
    <div className="App">
      <h1>The Love of the World Table</h1>

      <input
        placeholder="Name"
        onChange={(e) => {
          setNewName(e.target.value);
        }}
      />
      <input
        type={"number"}
        placeholder="Age"
        onChange={(e) => {
          setNewAge(e.target.value);
        }}
      />
      <button onClick={createUser}>Create User</button>

      <div>
        {users.map((user) => {
          return (
            <div key={user.id}>
              {" "}
              <h1>Name: {user.name}</h1>
              <h1>Age: {user.age}</h1>
              <button
                onClick={() => {
                  updateUserInc(user.id, user.age);
                }}
              >
                Increase Age
              </button>
              <button
                onClick={() => {
                  updateUserDec(user.id, user.age);
                }}
              >
                Decrease Age
              </button>
              <button
                onClick={() => {
                  deleteUser(user.id);
                }}
              >
                DELETE USER
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
