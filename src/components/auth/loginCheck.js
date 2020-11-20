import UserContext from "../context/UserContext";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import {useEffect, useContext} from 'react';

/* Checks if a user has previously logged in on the device
     and if the credentials are valid 
     -> Runs at start of accessing the website 
   */
  const history = useHistory();
  const { setUserData } = useContext(UserContext);
  
  export function loginCheck () {
    
    
    // Check if a user login token exists on the current device
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token","");
      let login
    
      Axios.post(
        "https://bff-backend.herokuapp.com/users/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } }
      )
      .then(res=>{
        if (res == true){
            login= true;
        } 
        if (res == false){
          // Invalid User -> reroutes to login
          login= false;
          history.push("/");
        }
      })
      .catch(err => {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          login= false;
          history.push("/");
        } else if (err.request) {
          // client never received a response, or request never left
          login= false;
          history.push("/");
        } else {
          // anything else
          login= false;
          history.push("/");
        }
    })

    if (login == true) {
      const userRes = await Axios.get("https://bff-backend.herokuapp.com/users/", {
              headers: { "x-auth-token": token },
            });
            setUserData({
              token,
              user: userRes.data,
            });
    }
    }
    checkLoggedIn();
  };

