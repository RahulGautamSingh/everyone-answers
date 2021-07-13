import React, { useEffect, useRef, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Box, Button } from "@material-ui/core";
import firebase from "firebase";
import {  db } from "./firebaseConfig";
const useStyles = makeStyles({
  container: {
    gap: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
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
    fontWeight: "500",
  },

  form: {
    width: "100%",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  header: {
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "10px",
    paddingRight: "30px",
  },
  errMsg: {
    color: "red",
    fontSize: "13px",
  },
});
export default function TeacherHomepage() {
  const classes = useStyles();
  let [userImage, setUserImage] = useState(null);
  let [studentList, setStudentList] = useState("");
  let [error, setError] = useState("");
  let [submitting,setSubmitting] = useState(false)
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        // ...
        console.log(user)
        setUserImage(user.photoURL);
      } else {
        // User is signed out
        // ...
        console.log(null);
      }
    });
  }, []);
  return (
    <React.Fragment>
      <CssBaseline />
      <Box className={classes.header}>
        <img src={userImage} alt="" className={classes.avatar} />
      </Box>
      <Container maxWidth="sm" className={classes.container}>
        <p className={classes.title}>My Students</p>
        <p className={classes.para}>
          Enter the name of each person who will answer your questions seperated
          by a comma or new line
        </p>

        <TextField
          id="outlined-multiline-static"
          multiline
          rows={10}
          placeholder="eg.Daniel,Philip,Arnav"
          variant="outlined"
          className={classes.form}
          onChange={(e) => setStudentList(e.target.value)}
        />
        <span className={classes.errMsg}>{error}</span>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
                setSubmitting(true)
                setError("");
              if (studentList === "") 
              {
                  setError("No student in the list.");
                  setSubmitting(false)
              }
              else {
                let arr = studentList;
                if (arr.includes(",")) arr = arr.split(",");
                else arr = arr.split("\n");
                let res = [];
                arr.forEach((elem, index) => {
                  if (arr.indexOf(elem) !== index) res.push(elem);
                });
                if (res.length !== 0)
                  {
                      setError(
                    "Duplicate names in the list.Please make sure that each name is unique.List:{" +
                      res.join(",") +
                      "}"
                  );
                  setSubmitting(false)
                      }
                else {
                  //add names in database
                  db.collection
                  setSubmitting(false)
                }
              }
            }}
          >
            Submit
          </Button>
{submitting && <Button>Submitting....</Button> }
        </Box>
      </Container>
    </React.Fragment>
  );
}