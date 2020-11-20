import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import UserContext from "../context/UserContext";
import { useHistory } from "react-router-dom";

// Material UI Imports
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
//import Link from '@material-ui/core/Link';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// Styling for the page
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [open, setOpen] = React.useState(false);

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  /* Checks if a user has previously logged in on the device
     and if the credentials are valid 
     -> Runs at start of accessing the website 
   */

  useEffect(() => {
    // Check if a user login token exists on the current device
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("x-auth-token", "");
      let login;

      await Axios.post("https://bff-backend.herokuapp.com/users/tokenIsValid", null, {
        headers: { "x-auth-token": token },
      })
        .then((res) => {
          if (res === true) {
            login = true;
          }
          if (res === false) {
            // Invalid User -> reroutes to login
            login = false;
            history.push("/");
          }
        })
        .catch((err) => {
          if (err.response) {
            // client received an error response (5xx, 4xx)
            login = false;
            history.push("/");
          } else if (err.request) {
            // client never received a response, or request never left
            login = false;
            history.push("/");
          } else {
            // anything else
            login = false;
            history.push("/");
          }
        });

      if (login === true) {
        const userRes = await Axios.get("https://bff-backend.herokuapp.com/users/", {
          headers: { "x-auth-token": token },
        });
        setUserData({
          token,
          user: userRes.data,
        });
      }
    };
    checkLoggedIn();
  }, [history, setUserData]);

  // Sign in user when clicked
  const submit = async (e) => {
    e.preventDefault();
    try {
      const loginUser = { email, password };
      const loginRes = await Axios.post(
        "https://bff-backend.herokuapp.com/users/login",
        loginUser
      );
      setUserData({
        token: loginRes.data.token,
        user: loginRes.data.user,
      });
      localStorage.setItem("x-auth-token", loginRes.data.token);
      history.push("/Home");
    } catch (error) {
      setOpen(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={submit}
          >
            Sign In
          </Button>
          <Snackbar
            open={open}
            autoHideDuration={30000}
            onClose={handleSnackClose}
          >
            <Alert onClose={handleSnackClose} severity="error">
              Incorrect email or password
            </Alert>
          </Snackbar>
        </form>
      </div>
    </Container>
  );
}
