import React, { useEffect, useState } from "react";
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
  let [error,setError] = useState([false,{}])
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
            let uid = result.user.uid;

            // email = email.replaceAll(".", "_");
            snapshot.forEach(async (doc) => {
              console.log(uid, doc.id);
              if (doc.id === uid) {
                console.log("MATCH");
                let studentList = await db
                  .collection("teachers")
                  .doc(uid)
                  .collection("session")
                  .get();
                if (studentList!==null && studentList!==undefined && studentList.size > 0) {
                  console.log("going to dashboard")
                  history.push("/dashboard");
                }
              }
            });

         history.push("/home") 
          })
          .catch((err) => {
            //Handle Error
            setError([true,err])
            
          });
      });
  }
  useEffect(() => {
    document.title = "Everyone Answers";
  }, []);
  return (
    <React.Fragment>
      <CssBaseline />
    {!error[0] &&   
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
}
      {error[0] && (
        <Container maxWidth={false} p={10}>
          <Box m={10} style={{ fontSize: "20px" }}>
            <p style={{ fontSize: "50px", margin: 0 }}>Error</p>
            <p>{"Error Code: " + error[1].code}</p>
            {"Firebase Error: " + error[1].message}
          </Box>
        </Container>
      )}
    </React.Fragment>
  );
}
