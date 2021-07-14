import firebase from "firebase";
import { db } from "./firebaseConfig";
import { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Box, Button } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    marginTop: "60px",
    width: "80%",
    marginLeft: "40px",
  },
  container: {
    margin: 0,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "5px",
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
  list: {
    display: "flex",
    flexFlow: "row wrap",
    width: "100%",
    height: "fit-content",
    gap: "20px",
  },
  form: {
    margin: 0,
    width: "400px",
  },
  stdName: {
    margin: 0,
    padding: 0,
  },
  dashboard: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  endBtn: {
    padding: "8px 24px",
    fontWeight: 600,
    marginRight: "20px",
  },
  endGrp: {
    display: "flex",
    gap: "10px",
  },
});

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  let [userImage, setUserImage] = useState(null);
  let [userEmail, setUserEmail] = useState(null);
  let [studentList, setStudentList] = useState([]);
  let [loading, setLoading] = useState(true);
  let [ending, setEnding] = useState(false);
  let [teacherKey, setTeacherKey] = useState(null);
  let history = useHistory();
let [error,setError] = useState([false,""])
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  async function endSession() {
    handleClose();
    try{
      setEnding(true);
      let id = userEmail.replaceAll(".", "_");
      deleteInBatch(db.collection("teachers").doc(id).collection("session"));
      await db.collection("teachers").doc(id).delete();
      setEnding(false);
      history.push("/home");
    }
    catch(error){
      setError([true,error])
      setEnding(false);
    }
    
  }

  let deleteInBatch = async (query, size = 100) => {
    try {
      let batch = db.batch();

      //get documents
      let values = await query.get();
      if (values.size > 0) {
        values.forEach((value) => {
          batch.delete(value.ref);
        });

        //Delete the documents in bulk
        batch.commit();
        if (values.size > 0) {
          //Recusively call the function again to finish
          //deleting the rest of documents
          deleteInBatch(query, size);
        }
      } else {
        //exist function
        return;
      }
    } catch (err) {
      throw err;
    }
  };
async function fetchData(){
  try{
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        // ...

        setUserImage(user.photoURL);
        setUserEmail(user.email);
        let teachersRef = db
          .collection("teachers")
          .doc(user.email.replaceAll(".", "_"));
        let teacher = await teachersRef.get();
        setTeacherKey(teacher.data().secretId);

        const listRef = db
          .collection("teachers")
          .doc(user.email.replaceAll(".", "_"))
          .collection("session");
        const snapshot = await listRef.get();

        let arr = [];
        snapshot.forEach((doc) => {
          arr.push(doc.id);
        });
        arr.sort(function (a, b) {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        });
        console.log(arr);
        setStudentList(arr);
        setLoading(false);
      } else {
        // User is signed out
        // ...
        console.log(null);
      }
    });
  }catch(error){
    setError([true,error])
    setLoading(false);
    
  }
}
  // eslint-disable-next-line
  useEffect(async () => {
    fetchData()
  
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
      {!loading && !error[0] && (
        <Box>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {" Do you wish to end this session?"}
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Disagree
              </Button>
              <Button onClick={endSession} color="primary" autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>

          <Box className={classes.header}>
            <img src={userImage} alt="" className={classes.avatar} />
          </Box>
          <Container maxWidth="false" className={classes.container}>
            <Box className={classes.dashboard}>
              <p className={classes.title}>DashBoard</p>
              <Box className={classes.endGrp}>
                {ending && <p>Ending...</p>}
                <Button
                  variant="contained"
                  className={classes.endBtn}
                  onClick={handleClickOpen}
                >
                  END SESSION
                </Button>
              </Box>
            </Box>

            <p className={classes.para}>
              Student Link:{" "}
              <a
                href={
                  window.location.href.split("/dashboard")[0] +
                  "/student/" +
                  teacherKey
                }
              >
                {window.location.href.split("/dashboard")[0] +
                  "/student/" +
                  teacherKey}
              </a>
            </p>
            <Box className={classes.list}>
              {studentList.length !== 0 &&
                studentList.map((elem) => {
                  const doc = db
                    .collection("teachers")
                    .doc(userEmail)
                    .collection("session")
                    .doc(elem);
                  const currtext = doc.onSnapshot(
                    (docSnapshot) => {
                      console.log(docSnapshot.data());
                    },
                    (err) => {
                      console.log(`Encountered error: ${err}`);
                    }
                  );
                  return (
                    <Box className={classes.studentBox}>
                      <p className={classes.stdName} style={{ color: "blue" }}>
                        {elem}
                      </p>
                      <TextField
                        id="outlined-multiline-static"
                        multiline
                        rows={7}
                        variant="outlined"
                        className={classes.form}
                        value={currtext}
                      />
                    </Box>
                  );
                })}
            </Box>
          </Container>
        </Box>
      )}
      {!loading && error[0] && (
        <Container maxWidth="false" p={10}>
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
