import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useContext } from "react";
import { UserContext } from "../UserContext";

import SearchListFile from "./SearchListFile";
function App() {
  const { userInfo } = useContext(UserContext);
  console.log(userInfo);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState("");
  const [selectedAccessLevel, setSelectedAccessLevel] = useState(null);



  const [allFiles, setallFiles] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);


  const updateAllFiles = (newAllFiles) => {
    setallFiles(newAllFiles);
    window.location.reload();
  };
  const handleSearch = async (query) => {
    console.log(query);
    try {
      const response = await fetch(`http://localhost:4001/api/fileupload/search/` + query, {
        credentials: 'include',
      });
      const results = await response.json();
      setSearchResults(results);
      console.log(searchResults);
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  };

  const onSearchInputChange = (query) => {
    setSearchQuery(query);

    // If the search input is blank, show all posts
    if (query.trim() === "") {
      setSearchResults([]);
    } else {
      handleSearch(query);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  /* pop up options*/
  const openPopup = (fileId) => {
    setShowPopup(true);
    setSelectedFileId(fileId);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedFileId(null);
  };

  const openPopup2 = (fileId) => {
    setShowPopup2(true);
    setSelectedFileId(fileId);
  };

  const closePopup2 = () => {
    setShowPopup2(false);
    setSelectedFileId(null);
  };
  const handleOptionChange = async (newAccessLevel, fileId) => {
    try {
      // Make an API call to update the access level in the database
      const response = await axios.put(
        `http://localhost:4001/api/update-access-level/${fileId}`,
        {
          accesslevel: newAccessLevel,
        },
        {
          withCredentials: true,
        }
      );
  
      // Handle the response, you may want to check for success and show a toast
      if (response.data.status === "ok") {
        toast.success("Access Level Updated Successfully!");
        // Assuming you want to update the access level for the specific file in state
        setallFiles((prevFiles) =>
          prevFiles.map((file) =>
            file._id === fileId ? { ...file, accesslevel: newAccessLevel } : file
          )
        );
      } else {
        toast.error("Failed to update access level");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update access level");
    }
  };
  
  /* */

  useEffect(() => {
    getPdf();


  }, []);

  const getPdf = async () => {
    const result = await axios.get("http://localhost:4001/api/get-files");
    console.log(result.data.data);
    setallFiles(result.data.data);
   
  };

  const submitFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("file", file);
    formData.append("username_", userInfo.username);
    formData.append("accessLevel", selectedAccessLevel);

    console.log("rrr  ", userInfo.username);
    if (!userInfo || userInfo.id === undefined) {
      toast.error("You need to sign in to upload a file.");
    }
    if (userInfo?.id !== undefined) {
      try {
        const result = await axios.post("http://localhost:4001/api/upload-files", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        console.log(result);

        if (result.data.status === "ok") {
          toast.success("File Uploaded Successfully!");
          getPdf();
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload file");
      }
    }
  };

  const showPdf = (pdf) => {
    window.open(`http://localhost:4001/files/${pdf}`, "_blank", "noreferrer");
  };

  const deletePdf = async (pdf) => {
    getPdf();
    console.log(pdf);
    try {
      const result = await axios.get(`http://localhost:4001/api/delete/${pdf}`);
      console.log(result);

      if (result.data.status === "ok") {
        toast.error("File Deleted Successfully!");
        getPdf();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete file");

    }
  };

  return (<>
    <SearchBar
      value={searchQuery}
      onSearch={onSearchInputChange}
      onClear={clearSearch}
    />
    <div className="op-results">
      {searchResults && searchResults.length > 0 ? (
        <>
          <SearchListFile searchResults={searchResults} handleSearch={handleSearch} searchQuery={searchQuery} updateAllFiles={updateAllFiles} />
          <br />

        </>
      ) : (
        ""
      )}
    </div>
    <div className="App">


      <div className="inp-div">

        <form className="formStyle" onSubmit={submitFile}>
          <h4 className="upload-h4">Upload File</h4>
          <br />
          <input
            type="text"
            className="form-control-text"
            placeholder="Title"
            required
            onChange={(e) => setTitle(e.target.value)}
          />

          <br />
          <textarea
            className="form-control-text-area"
            placeholder="Content"
            required
            rows="5"
            cols="35"
            onChange={(e) => setContent(e.target.value)}
          />
          <br />
          <input
            type="file"
            className="form-control"
            accept="*/*"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />
          <br />
          <button className="btn-primary" type="submit">
            Submit
          </button>
        </form>
      </div>
      <div className="uploaded">

        <h4>Uploaded Files:</h4>
        <div className="output-div">

          {
            allFiles == null
              ? ""
              : allFiles.map((data) => {

                return (

                  <div className="inner-div" key={data.pdf}>
                    {(userInfo.username === data.username_) && (


                      <div className="settings-file">
                        <a onClick={() => openPopup(data._id)} className="settings-file-link">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </a>
                        <a onClick={() => openPopup2(data._id)} className="settings-file-link">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                          </svg>

                        </a>
                        {(showPopup2 && selectedFileId === data._id) && (
                          <div className="popup-wrapper">
                            <div className="popup">
                              <p style={{ textAlign: "right" }}><i>Access Public: enabled <br/> Access Private: disabled</i></p>
                              <p dangerouslySetInnerHTML={{ __html: `<b>Access Level:</b> ${data.accesslevel}` }} />
                              <p dangerouslySetInnerHTML={{ __html: `<b>File Name:</b> ${data.pdf}` }} />
                              <button type="button" onClick={closePopup2}>
                                Close
                              </button>
                            </div>

                          </div>
                        )}
                        {(showPopup && selectedFileId === data._id) && (
                          <div className="popup-wrapper">
                            <div className="popup">
                              <form>
                                <label className="radio-icon">  <svg className="lock-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                                  <input
                                    type="radio"
                                    name={data._id}
                                    value="disabled"
                                    checked={data.accesslevel === "disabled"}
                                    onChange={() => handleOptionChange("disabled", data._id)}
                                  />

                                  Private Access
                                </label>
                                <label className="radio-icon">
                                  <svg className="lock-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                  </svg>

                                  <input
                                    type="radio"
                                    name={data._id}
                                    value="enabled"
                                    checked={data.accesslevel === "enabled"}
                                    onChange={() => handleOptionChange("enabled", data._id)}
                                  />

                                  Public Access
                                </label>
                                <button type="button" onClick={closePopup}>
                                  Close
                                </button>
                              </form>
                            </div>
                          </div>
                        )}

                      </div>)}

                    {((userInfo.username === data.username_) || (data.accesslevel === 'enabled')) && (
                      <Link to={`/edit-upload/${data._id}`}><button className="edit"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>Edit</button></Link>)}

                    <h5 className="upload-h5">Author: {data.username_}</h5>

                    <h5 className="upload-h5">Title: {data.title}</h5>
                    <div className="upload-h5" dangerouslySetInnerHTML={{ __html: data.content }} />
                    {/* <p className="upload-h5">Content: {data.content}</p> */}
                    <div className="inner-div2">
                      <button className="btn-primary" onClick={() => showPdf(data.pdf)} title={`PDF: ${data.pdf}`}>
                        Show file
                      </button>
                      {(userInfo.username === data.username_ || userInfo.username === 'admin' || data.accesslevel === 'enabled') && (
                        <button className="btn-primary2" onClick={() => deletePdf(data.pdf)}>
                          Delete file
                        </button>)}
                    </div>
                  </div>
                );
              })}






        </div>
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
  </>
  );
}

export default App;
