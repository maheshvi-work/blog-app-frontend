import { useEffect, useState,useContext } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";

function App() {
  const [title, setTitle] = useState("");
  const [access, setAccess] = useState("");
  const [content, setContent] = useState("");
  const [uname, setUname] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { id } = useParams();
  const { userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4001/api/get-files/' + id).then(response => {
        response.json().then(postFile => {
            setTitle(postFile.title);
            setContent(postFile.content);
            setAccess(postFile.accesslevel);
            setUname(postFile.username_);
            
        });
    });
  }, []);

  async function updateFile(ev) {
    ev.preventDefault();
    if(!userInfo || userInfo.id === undefined){
      toast.error("User information is missing. Unable to update file.");
    }
    if ((userInfo.username === uname ) || (access==='enabled')) {
    const data = new FormData();
    data.set('title', title);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    const response = await fetch('http://localhost:4001/api/file-edit', {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });

  
    if (response.ok) {
      setRedirect(true);
    }
    }
    else{
      toast.error("Access Disabled");
    }
   
 
  }

  if (redirect) {
    return <Navigate to={'/upload'} />
  }




  return (
    <div className="App">
      <div className="inp-div">
      <form className="formStyle" onSubmit={updateFile}>
        <h4 className="upload-h4">Edit File</h4>
        <br />
        <input
          type="text"
          className="form-control-text"
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />
        <textarea
          className="form-control-text-area"
          placeholder="Content"
          required
          rows="5"
          cols="35"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br/>
        <input
          type="file"
          className="form-control"
          accept="*/*"
         
          onChange={ev => setFiles(ev.target.files)}
        />
        <br />
        <button className="btn-primary" type="submit">
          Submit
        </button>
      </form>
      </div>
    

      {/* Toast Container for Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="custom-toast"
        closeButton={false} 
      />
    </div>
  );
}

export default App;
