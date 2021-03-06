import React, { useContext, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { mainListItems } from "../dashboard/listItems";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Chart from "../dashboard/Chart";
import Deposits from "../dashboard/Deposits";
import DisplayOutOfStock from "../dashboard/DisplayOutOfStock";
import DisplayLowStock from "../dashboard/DisplayLowStock";
// import Orders from './Orders';
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import { useCookies } from "react-cookie";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard() {
  const [cookies, setCookie] = useCookies(["themeShade"]);
  const { setUserData } = useContext(UserContext);
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  //Open the side menu
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  //Open the side menu
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  //When the profile icon is clicked change the state from its previous state
  const handleProfileToggle = () => {
    setProfileOpen((prevOpen) => !prevOpen);
  };

  //Close the list of menu items
  const handleProfileClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setProfileOpen(false);
  };

  //Close the list of menu items for the profile face if the tab key is pressed
  function handleProfileListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setProfileOpen(false);
    }
  }

  //Remove token when log out
  const logout = (event) => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.removeItem("x-auth-token");
    setProfileOpen(false);
  };

  const handleThemeChange = () => {
    if (cookies.themeShade === "light") {
      setCookie("themeShade", "dark", { path: "/" });
    } else if (cookies.themeShade === "dark") {
      setCookie("themeShade", "light", { path: "/" });
    }
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

      Axios.post("https://bff-api-showcase.herokuapp.com/users/tokenIsValid", null, {
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
        const userRes = await Axios.get("https://bff-api-showcase.herokuapp.com/users/", {
          headers: { "x-auth-token": token },
        });
        setUserData({
          token,
          user: userRes.data,
        });
      }
    };
    checkLoggedIn();
  });

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(profileOpen);
  React.useEffect(() => {
    if (prevOpen.current === true && profileOpen === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = profileOpen;
  }, [profileOpen]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            BFF Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleThemeChange}>
            <EmojiObjectsIcon />
          </IconButton>
          <IconButton
            color="inherit"
            ref={anchorRef}
            aria-controls={profileOpen ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleProfileToggle}
          >
            <AccountCircleIcon />
            <Popper
              open={profileOpen}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleProfileClose}>
                      <MenuList
                        autoFocusItem={profileOpen}
                        id="menu-list-grow"
                        onKeyDown={handleProfileListKeyDown}
                      >
                        {/*add clear login token */}
                        <MenuItem
                          onClick={logout}
                          // onClick={logout}
                          component={Link}
                          to="/"
                        >
                          Logout
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>

        <Divider />
        <List>{mainListItems}</List>
      </Drawer>
      <main className={classes.content} style={{ alignItems: "right" }}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={4}>
              <Paper className={fixedHeightPaper}>
                {/* <Out of stock items />
                 */}

                <DisplayOutOfStock />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <Paper className={fixedHeightPaper}>
                {/* <Orders />
                 */}
                <DisplayLowStock />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <Paper className={fixedHeightPaper}>
                <Deposits />
              </Paper>
            </Grid>

            {/* Chart */}
            <Grid item xs={12} md={12} lg={12}>
              <Paper className={fixedHeightPaper} style={{ height: 500 }}>
                <Chart />
              </Paper>
            </Grid>
            {/* Recent Deposits */}

            {/* Recent Orders */}
          </Grid>
        </Container>
      </main>
    </div>
  );
}
