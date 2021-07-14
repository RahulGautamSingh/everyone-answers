import React, { useEffect,  useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Box, Button } from "@material-ui/core";
import firebase from "firebase";
import { db } from "./firebaseConfig";
import { useHistory } from "react-router-dom";
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";


const useStyles = makeStyles({
  root:{
    marginTop:"60px",
    width:"80%",
    marginLeft:"40px"
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
  let [submitting, setSubmitting] = useState(false);
  let [username,setUsername] = useState(null)
  const history = useHistory()
  let [userEmail,setUserEmail] = useState(null)
  let [loading,setLoading] = useState(true)
  const [open, setOpen] = React.useState(false);
 let [callError,setCallError] = useState([false,""])
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
   
    setOpen(false);
  };
  
  function logOut(){
    try{
      firebase.auth().signOut().then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
      history.push("/");
      handleClose()
    }catch(err){
      setCallError([true,err])

    }
   
  }
async function fetchData(){
  try{
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        // ...
        console.log(user)
        setUserImage(user.photoURL);
        setUserEmail(user.email);
        setUsername(user.displayName);
        setLoading(false)
      } else {
        // User is signed out
        // ...
        console.log(null);
      }
    });
  }catch(error){
    setCallError([true,error])
    setLoading(false)
  }
 
}
  useEffect(() => {
   fetchData()
  }, []);
  return (
  
    <React.Fragment>
      <CssBaseline />
      {loading &&  <div className={classes.root}>
          <h1>Loading</h1>
      <LinearProgress />
      
    </div>}
      {!loading && !callError[0] &&
     <Box>
         <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {" Are you sure you want to log out?"}
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Disagree
              </Button>
              <Button onClick={logOut} color="primary" autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
      <Box className={classes.header} onClick={handleClickOpen}>
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
            onClick={async () => {
              setSubmitting(true);
              setError("");
              if (studentList === "") {
                setError("No student in the list.");
                setSubmitting(false);
              } else {
                let arr = studentList;
                if (arr.includes(",")) arr = arr.split(",");
                else arr = arr.split("\n");
                let res = [];
                arr.forEach((elem, index) => {
                  if (arr.indexOf(elem) !== index) res.push(elem);
                });
                if (res.length !== 0) {
                  setError(
                    "Duplicate names in the list.Please make sure that each name is unique.List:{" +
                      res.join(",") +
                      "}"
                  );
                  setSubmitting(false);
                } else {
                  //add names in database
                  try{
                    let id = userEmail.replaceAll(".","_")
                    let rand = parseInt(Math.random()*1000000000, 10);
   
                    await db.collection("teachers").doc(id).set({
                     id:userEmail,
                     name:username,
                     secretId:rand
                   })
                     arr.forEach(async (elem) => {
                       await db
                         .collection("teachers")
                         .doc(id)
                         .collection("session")
                         .doc(elem)
                         .set({
                           answer: ""
                         });
                     });
                     setSubmitting(false);
                     history.push("/dashboard")
                  }
                 catch(error){
                   setCallError([true,error])
                   setSubmitting(false)
                 }
                }
              }
            }}
          >
            Submit
          </Button>
          {submitting && <Button>Submitting....</Button>}
        </Box>
      </Container>
      </Box>
      }
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
