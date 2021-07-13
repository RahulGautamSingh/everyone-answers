import firebase from "firebase";
import { db } from "./firebaseConfig";
import { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Box, Button } from "@material-ui/core";
import LinearProgress from '@material-ui/core/LinearProgress';

import React from "react";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles({
   root:{
       marginTop:"60px",
       width:"80%",
       marginLeft:"40px"
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
  dashboard:{
      display:"flex",
      justifyContent:"space-between",
      width:"100%",
      alignItems:"center"
  },
  endBtn:{
      padding:"8px 24px",
      fontWeight:600,
      marginRight:"20px"
  },
  endGrp:{
      display:"flex",
      gap:"10px"
  }
});

export default function Dashboard() {
  const classes = useStyles();

  let [userImage, setUserImage] = useState(null);
  let [userEmail, setUserEmail] = useState(null);
  let [studentList, setStudentList] = useState([]);
  let [loading,setLoading] = useState(true)
  let [ending,setEnding] = useState(false)
  let history = useHistory()

  useEffect(async() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        // ...
        
        setUserImage(user.photoURL);
        setUserEmail(user.email);
        const listRef = db
          .collection("teachers")
          .doc(user.email.replaceAll(".","_"))
          .collection("session");
        const snapshot = await listRef.get();
        let arr = [];
        snapshot.forEach((doc) => {
          arr.push(doc.id);
        });
        arr.sort(function(a, b){
            if(a < b) { return -1; }
            if(a> b) { return 1; }
            return 0;
        })
        setStudentList(arr);
        setLoading(false)
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
      {loading &&  <div className={classes.root}>
          <h1>Loading</h1>
      <LinearProgress />
      
    </div>}
      {!loading &&
      <Box>

      
      <Box className={classes.header}>
        <img src={userImage} alt="" className={classes.avatar} />
      </Box>
      <Container maxWidth="lg" className={classes.container}>
          <Box className={classes.dashboard}>
          <p className={classes.title}>DashBoard</p>
          <Box className={classes.endGrp}>
             {ending && <p>Ending...</p>}
          <Button variant="contained" className={classes.endBtn}
          onClick={
             async ()=>{
                 setEnding(true)
                  let id = userEmail.replaceAll(".","_");
                  let sessionRef = db.collection("teachers").doc(id).collection("session")
                  let snapshot = await sessionRef.get()
                  snapshot.forEach(async(elem)=>{
                   await  db.collection("teachers").doc(id).collection("session").doc(elem).delete()
                  })
                  await db.collection("teachers").doc(id).delete()
                  setEnding(false)
                  history.push("/home")
              }
          }
          
          >END SESSION</Button>
          </Box>
          </Box>
        
        <p className={classes.para}>
          Student Link: <a href="https://google.com">https://google.com</a>
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
      }
    </React.Fragment>
  );
}
