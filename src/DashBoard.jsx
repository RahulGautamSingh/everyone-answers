import firebase from "firebase";
import { db } from "./firebaseConfig";
import { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
// import TextField from "@material-ui/core/TextField";
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
    gap: "30px",
    padding: "20px",
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
    height:"40px",
    fontWeight: 600,
    marginRight: "20px",
  },
  clrBtn:{
    // padding: "8px 24px",
    fontWeight: 600,
   
  },
  endGrp: {
    display: "flex",
    gap: "10px",
    alignItems:"center"
  },
  displayBox: {
    border: "1.5px solid #3d50b6",
    borderRadius: "5px",
    width: "380px",
    height: "250px",
    padding: "10px",
  },
});

export default function Dashboard() {
  const classes = useStyles();
  const history = useHistory();

  let [open, setOpen] = useState(false);
  let [userImage, setUserImage] = useState(null);
  let [userEmail, setUserEmail] = useState(null);
  let [studentList, setStudentList] = useState([]);
  let [loading, setLoading] = useState(true);
  let [ending, setEnding] = useState(false);
  let [teacherKey, setTeacherKey] = useState(null);
  let [error, setError] = useState([false, ""]);
let [clearing,setClearing] = useState(false)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function endSession() {
    handleClose();
    try {
      setEnding(true);
      let id = userEmail.replaceAll(".", "_");
      //real-time coonnection close
      const unsub = db.collection('teachers').doc(id).collection("session").onSnapshot(() => {
      });
      unsub();
      //deleting session collection
      deleteInBatch(db.collection("teachers").doc(id).collection("session"));
      //deleting curr teacher doc
      await db.collection("teachers").doc(id).delete();
      //finish ending call and move to homepage
      setEnding(false);
      history.push("/home");
    } catch (error) {
      setError([true, error]);
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
      setError([true, error]);
      setEnding(false);
    }
  };

  async function fetchData() {
    try {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          //get user-image and email
          setUserImage(user.photoURL);
          setUserEmail(user.email);


          let teachersRef = db
            .collection("teachers")
            .doc(user.email.replaceAll(".", "_"));
            //get curr teacher doc
          let teacher = await teachersRef.get();
          //get  secretId of teacher
          setTeacherKey(teacher.data().secretId);
          //see the list of students of curr teacher
          const listRef = db
            .collection("teachers")
            .doc(user.email.replaceAll(".", "_"))
            .collection("session");
          listRef.onSnapshot(snapshot=>{
            let arr = [];
            snapshot.forEach((doc) => {
              arr.push([doc.id, doc.data().answer]);
              
            });
            arr.sort(function (a, b) {
              if (a[0] < b[0]) {
                return -1;
              }
              if (a[0] > b[0]) {
                return 1;
              }
              return 0;
            });
  
            setStudentList(arr);
          });

      
          setLoading(false);
        } else {
          // User is signed out
          // ...
          console.log(null);
        }
      });
    } catch (err) {
      setError([true, err]);
      setLoading(false);
    }
  }
  // eslint-disable-next-line
  useEffect(async () => {
    fetchData();

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

          <Container maxWidth={false} className={classes.container}>
            <Box className={classes.dashboard}>
              <Box style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <p className={classes.title}>DashBoard</p>
              <Button
            variant="contained"
            color="primary"
            className={classes.clrBtn}
            onClick={async() => {
             setClearing(true)
            
             try{
                studentList.forEach(async(elem)=>{
                  await  db
                  .collection("teachers")
                  .doc(userEmail.replaceAll(".", "_"))
                  .collection("session").doc(elem[0]).set({
                    answer:""
                  })
                
                })
                setTimeout(()=>setClearing(false),500)

             }catch(err){
               setError([true,err])
               setTimeout(()=>setClearing(false),500)
             }
            }}
          >
            Clear Answers
          </Button>
              </Box>
              
              <Box className={classes.endGrp}>
                {ending && <p style={{fontWeight:600}}>Ending...</p>}
                {clearing && <p style={{fontWeight:600}}>Clearing Answers...</p>}
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
                  return (
                    <Box className={classes.studentBox}>
                      <p
                        className={classes.stdName}
                        style={{ color: "#3d50b6" }}
                      >
                        {elem[0]}
                      </p>
                      <Box className={classes.displayBox}>{elem[1]}</Box>
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
