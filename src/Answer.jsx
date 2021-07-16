import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Box } from "@material-ui/core";
// import firebase from "firebase";
import { db } from "./firebaseConfig";
// import { useHistory } from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  root: {
    marginTop: "60px",
    width: "80%",
    marginLeft: "40px",
  },
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
    marginBottom: 0,
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
  username: {
    margin: 0,
    marginTop: "50px",
    padding: 0,
    fontSize: "20px",
  },
});

export default function Answer(props) {
  const classes = useStyles();
  let [syncing, setSyncing] = useState(false);
  let [loading, setLoading] = useState(true);
  let [callError, setCallError] = useState([false, ""]);
  let [syncComp, setSyncComp] = useState(false);
  let [currtext, setcurrText] = useState("");
  async function changeText(text) {
    setSyncing(true);
    let answerRef = db
      .collection("teachers")
      .doc(props.teacher)
      .collection("session")
      .doc(props.user);
    try {
      await answerRef.set({
        answer: text,
      });
      setSyncing(false);
      setSyncComp(true);
      setTimeout(() => setSyncComp(false), 2000);
    } catch (err) {
      setCallError([true, err]);
      setSyncing(false);
      setSyncComp(true);
      setTimeout(() => setSyncComp(false), 2000);
    }
  }
  function clearTextField() {
    setcurrText("");
  }
  async function createConnection() {
    let answerRef = db
      .collection("teachers")
      .doc(props.teacher)
      .collection("session")
      .doc(props.user);
    answerRef.onSnapshot((snapshot) => {
      console.log(snapshot.data());
      if (snapshot.data().answer === "") clearTextField();
    });
  }

  useEffect(() => {
    createConnection();
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      {loading && (
        <div className={classes.root}>
          <h1>Loading</h1>
          <LinearProgress />
        </div>
      )}
      {!loading && !callError[0] && (
        <Container maxWidth="sm" className={classes.container}>
          <p className={classes.username}>{props.user}</p>
          <p className={classes.title}>My Answer</p>
          <p className={classes.para}>
            Enter your answer below. This text is visible to the teacher.
          </p>

          <TextField
            id="outlined-multiline-static"
            multiline
            rows={10}
            placeholder="Answer here..."
            variant="outlined"
            className={classes.form}
            onChange={(e) => {
              setcurrText(e.target.value);
              changeText(e.target.value);
            }}
            value={currtext}
          />

          {syncing && !syncComp && (
            <span style={{ margin: 0, padding: 0, color: "#3d50b6" }}>
              Syncing....
            </span>
          )}
          {!syncing && syncComp && (
            <span style={{ margin: 0, padding: 0, color: "#3d50b6" }}>
              Sync Complete
            </span>
          )}
        </Container>
      )}
      {!loading && callError[0] && (
        <Container maxWidth="false" p={10}>
          <Box m={10} style={{ fontSize: "20px" }}>
            <p style={{ fontSize: "50px", margin: 0 }}>Error</p>
            <p>{"Error Code: " + callError[1].code}</p>
            {"Firebase Error: " + callError[1].message}
          </Box>
        </Container>
      )}
    </React.Fragment>
  );
}
