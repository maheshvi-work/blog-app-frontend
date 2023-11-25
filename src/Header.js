import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import Switch from "react-switch";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("isDarkMode") === "true");

  /* End search bar test */

  useEffect(() => {

    fetch('http://localhost:4001/profile', {
      credentials: 'include',
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
       
      })
    })
  }, []);

  useEffect(() => {
    // Update the theme based on the isDarkMode state
    if (isDarkMode) {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }

    localStorage.setItem("isDarkMode", isDarkMode);
  }, [isDarkMode]);

  function logout() {
    fetch('http://localhost:4001/logout', {
      credentials: 'include',
      method: 'GET',
    });
    setUserInfo(null);
  
  }




  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">My Blog</Link>

      {username && (<p className="welcome">Hi {username} ! ,</p>)}
      <nav>
        {username && (
          <>

            {/* Display search results */}

            <div className="header-div"> <Link to="/create"> Create New Post</Link></div>
            <div className="header-div"> <Link to="/upload"> File Drive <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
            </svg>
            </Link>
            
            </div>
            <div className="header-div"><a onClick={logout}>Logout</a></div>
            <Switch
              onChange={(checked) => setIsDarkMode(checked)} // Toggle dark mode
              checked={isDarkMode}

              checkedIcon="🔆"
              uncheckedIcon="🌙"
              onColor="#2196F3"
              offColor="#616161"
            />
          </>
        )}
        {!username && (
          <>
            <div className="header-div"><Link to="/login" >Login</Link></div>
            <div className="header-div"><Link to="/register" >Register</Link></div>
            <Switch
              onChange={(checked) => setIsDarkMode(checked)} // Toggle dark mode
              checked={isDarkMode}

              checkedIcon="🔆"
              uncheckedIcon="🌙"
              onColor="#2196F3"
              offColor="#616161"
            />
          </>
        )}




      </nav>
    </header>

  )
}