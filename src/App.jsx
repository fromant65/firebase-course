import Auth from "./components/Auth";
import "./App.css";
import { db, auth, storage } from "../config/firebase";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);
  //Movie form states
  const [movieName, setMovieName] = useState("");
  const [movieDate, setMovieDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [movieOscar, setMovieOscar] = useState(false);

  //Update Title State
  const [newTitle, setNewTitle] = useState("");

  //File State
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  async function getMovieList() {
    //READ THE DATA
    //SET THE MOVIE LIST
    try {
      const docs = await getDocs(moviesCollectionRef); //Obtiene los docs de la DB
      const data = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id })); //Filtra los Docs para recibir solo la Data importante
      setMovieList(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function onSubmitMovie() {
    try {
      await addDoc(moviesCollectionRef, {
        title: movieName,
        releaseDate: new Date(movieDate),
        receivedAnOscar: movieOscar,
        userId: auth?.currentUser?.uid,
      });
      setMovieName("");
      setMovieDate(new Date().toISOString().slice(0, 10));
      setMovieOscar(false);
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteMovie(id) {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  }

  async function updateMovieTitle(id) {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: newTitle });
    getMovieList();
  }

  async function uploadFile() {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `files/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getMovieList();
  }, []);

  return (
    <div className="App">
      <Auth />
      <div>
        <input
          type="text"
          placeholder="Name"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
        />
        <input
          type="date"
          placeholder="Release Date"
          value={movieDate}
          onChange={(e) => setMovieDate(e.target.value)}
        />
        <input
          type="checkbox"
          checked={movieOscar}
          onChange={(e) => setMovieOscar(e.target.checked)}
        />
        <label htmlFor="">Received an Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>
      <div>
        {movieList.map((movie) => {
          const { title, receivedAnOscar, releaseDate, id } = movie;
          const date = new Date(releaseDate.seconds * 1000).toISOString();
          return (
            <div key={id}>
              <div>Title: {title}</div>
              <div>Oscar: {receivedAnOscar ? "yes" : "no"}</div>
              <div>Date: {date}</div>
              <button onClick={() => deleteMovie(movie.id)}>
                Delete Movie
              </button>
              <input
                type="text"
                placeholder="New name"
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <button onClick={() => updateMovieTitle(movie.id)}>
                Update Movie
              </button>
            </div>
          );
        })}
      </div>
      <div>
        <input
          type="file"
          onChange={(e) => {
            console.log(e.target.files[0].name);
            setFileUpload(e.target.files[0]);
          }}
        />
        <button onClick={uploadFile}>Upload file</button>
      </div>
    </div>
  );
}

export default App;
