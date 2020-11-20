import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import UserContext from "./components/context/UserContext";

// Import Pages
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Inventory from "./components/inventory/Inventory";
import SignUp from "./components/auth/SignUp";
import Orders from "./components/orders/Orders";

// Colors
import { createMuiTheme } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/deepOrange";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";

// Import Styling
import "./style.css";
import { useCookies } from "react-cookie";

export default function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  const [cookies, setCookie] = useCookies(["themeShade"]);
  if (cookies.themeShade === undefined) {
    setCookie("themeShade", "light", { path: "/" });
  }

  const theme = createMuiTheme({
    palette: {
      type: cookies.themeShade,
      primary: {
        main: orange[400],
        contrastText: "#fff",
      },
      secondary: {
        main: green[500],
      },
    },
  });

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ userData, setUserData }}>
          <MuiThemeProvider theme={theme}>
            <div className="container">
              <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/home" component={Dashboard} />
                <Route path="/inventory" component={Inventory} />
                <Route path="/register" component={SignUp} />
                <Route path="/orders" component={Orders} />
              </Switch>
            </div>
          </MuiThemeProvider>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}
