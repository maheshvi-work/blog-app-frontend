// SearchResultsPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState,useEffect,useContext } from 'react';

import { UserContext } from "../UserContext";


export default function SearchList({searchResults,handleSearch,searchQuery, updateAllFiles}) {

  const { userInfo } = useContext(UserContext);
  const [allFiles, setallFiles] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState("disabled");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAccessLevel, setSelectedAccessLevel] = useState("disabled");
  useEffect(() => {
    getPdf();
   
  }, []);

  const openPopup = (pdf) => {
    setShowPopup(true);
    setSelectedFile(pdf);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedFile(null);
  };

  const handleOptionChange = async (e) => {
    const newAccessLevel = e.target.value;
    setSelectedOption(newAccessLevel);
    setSelectedAccessLevel(newAccessLevel);
    try {
      // Make an API call to update the access level in the database
      const response = await axios.put(
        `http://localhost:4001/update-access-level/${selectedFile}`,
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
      } else {
        toast.error("Failed to update access level");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update access level");
    }
  };
  const getPdf = async () => {
    const result = await axios.get("http://localhost:4001/get-files");
    console.log(result.data.data);
    setallFiles(result.data.data);
    if (result.data.data && result.data.data.length > 0) {
      const initialAccessLevel = result.data.data[0].accesslevel;
      setSelectedOption(initialAccessLevel);
    }
  };
  const showPdf = (pdf) => {
    window.open(`http://localhost:4001/files/${pdf}`, "_blank", "noreferrer");
  };

  const deletePdf = async (pdf) => {
    getPdf();
    console.log(pdf);
    try {
      const result = await axios.get(`http://localhost:4001/delete/${pdf}`);
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

    return(searchResults.map((data) => (
      <div className="inner-div" key={data.pdf}>
      {(userInfo.username === data.username_ ) && (


        <div className="settings-file">
          <a onClick={() => openPopup(data.pdf)} className="settings-file-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </a>
          {(showPopup && selectedFile === data.pdf) && (
            <div className="popup-wrapper">
              <div className="popup">
                <form>
                  <label className="radio-icon">  <svg className="lock-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
</svg>
                    <input
                      type="radio"
                      name="status"
                      value="disabled"
                      checked={selectedOption === "disabled"}
                      onChange={handleOptionChange}
                    />

                    Private Access
                  </label>
                  <label className="radio-icon">
                  <svg className="lock-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
</svg>

                    <input
                      type="radio"
                      name="status"
                      value="enabled"
                      checked={selectedOption === "enabled"}
                      onChange={handleOptionChange}
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

      {((data.accesslevel === 'enabled')||(userInfo.username === data.username_)) && (
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
      )));
}


