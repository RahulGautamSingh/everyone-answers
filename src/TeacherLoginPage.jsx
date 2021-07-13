import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Box, Button } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { provider, db } from "./firebaseConfig";
import firebase from "firebase";
import google from "./google.png";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  container: {
    gap: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    margin: 0,
    padding: 0,
    fontSize: "60px",
    fontWeight: "500",
  },
  para: {
    margin: 0,
    padding: 0,
    fontSize: "16px",
    fontWeight: "600",
  },
  signInBtn: {
    fontSize: "13px",
    fontWeight: "700",
  },
  logo: {
    width: "25px",
    marginRight: "5px",
  },
});
export default function TeacherLogin() {
  const classes = useStyles();
  const history = useHistory();
  function onSignIn() {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return firebase
          .auth()
          .signInWithPopup(provider)
          .then(async (result) => {
            let teachersRef = db.collection("teachers");
            let snapshot = await teachersRef.get();
            let email = result.user.email;

            email = email.replaceAll(".", "_");
            let flag = false;
            snapshot.forEach((doc) => {
              console.log(email, doc.id);
              if (doc.id === email) {
                console.log("MATCH");
                flag = true;
              }
            });

            !flag ? history.push("/home") : history.push("/dashboard");
          })
          .catch((error) => {
            //Handle Error
            console.log(error);
          });
      });
  }
  useEffect(() => {
    document.title = "Everyone Answers";
  }, []);
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" className={classes.container}>
        <p className={classes.title}>Everyone Answers</p>
        <p className={classes.para}>Welcome, Please sign in </p>
        <Box>
          <AccountCircleIcon color="disabled" style={{ fontSize: 150 }} />
        </Box>

        <Button
          onClick={onSignIn}
          className={classes.signInBtn}
          variant="contained"
        >
          <img src={google} alt="" className={classes.logo} />
          SIGN IN WITH GOOGLE
        </Button>
      </Container>
    </React.Fragment>
  );
}
