import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const{setUserInfo} =useContext(UserContext);
    const [redirect, setRedirect] = useState(false);

    async function login(ev) {
        ev.preventDefault();

        const response = await fetch('https://my-blog-app-mvi.onrender.com/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',

        })
        if (response.ok) {
            response.json().then(userInfo=>{
                setUserInfo(userInfo)
                setRedirect(true);
            })
            
        }
        else {
            alert("Login Failed")
        }

    }
    
    if (redirect) {
        var currentdate = new Date();
        var datetime = "Sys Time: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        console.log(datetime)
        return <Navigate to={'/'} />
    }
    return (
        <form className="register" onSubmit={login}>
            <h1> Login</h1>
            <input type="text"
                placeholder="username"
                value={username}
                onChange={ev => setUsername(ev.target.value)} 
                />


            <input type="password"
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
                 />


            <button>Login</button>
        </form>
    )
}