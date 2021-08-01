import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { useParams } from "react-router-dom";
import { db } from "./firebaseConfig";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Box, Button } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Answer from "./Answer";

const useStyles = makeStyles({
  root: {
    marginTop: "60px",
    width: "80%",
    marginLeft: "40px",
  },
  container: {
    marginTop: "50px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  title: {
    fontSize: "30px",
    margin: 0,
  },
  select: {
    width: "280px",
  },
});
export default function Student() {
  let params = useParams();
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState([false, ""]);
  // eslint-disable-next-line
  let [studentList, setStudentList] = useState([]);
  const classes = useStyles();
  let [notSelected, setNotSelected] = useState(true);
  let [student, setStudent] = React.useState("");
  let [currStudent, setCurrStudent] = useState(null);
  let [user,setUser] = useState(null)
  const handleChange = (event) => {
    console.log(event.target.value)
    setStudent(event.target.value);
    setCurrStudent(event.target.value);
  };
  async function fetchList(teacher) {
    console.log(teacher);
    try {
      let teacherRef = db
        .collection("teachers")
        .doc(teacher)
        .collection("session");
      let list = await teacherRef.get();
      let arr = [];
      list.forEach((elem) => {
        arr.push(elem.id);
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
      setCurrStudent(arr[0]);
      setLoading(false);
    } catch (error) {
      console.log(error.message, error.code);
      setError([true, error]);
      setLoading(false);
    }
  }
  // eslint-disable-next-line
  useEffect(async () => {
    try {
      let id = parseInt(params.id);
      console.log("id", id);
      let teachersRef = db.collection("teachers");
      let teachers = await teachersRef.get();
      let teacher = "";
      teachers.forEach((elem) => {
        //   console.log(elem.secretId)
        if (elem.data().secretId === id) teacher = elem.id;
      });
      setUser(teacher)
      fetchList(teacher);
    } catch (error) {
      console.log(error.message);
      setError([true, error]);
      setLoading(false);
    }

    // eslint-disable-next-line
  }, []);
  return (
    <React.Fragment>
      <CssBaseline />

      {loading && notSelected && (
        <div className={classes.root}>
          <h1>Loading</h1>
          <LinearProgress />
        </div>
      )}
      {!loading && studentList.length !== 0 && !error[0] && notSelected && (
        <Container maxWidth="md" className={classes.container}>
          <p className={classes.title}>Select Your Name</p>

          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={student}
            onChange={handleChange}
            className={classes.select}
            placeholder={studentList[0]}
            displayEmpty="false"
            renderValue={() => currStudent}
          >
            {studentList.map((elem) => {
              return <MenuItem value={elem}>{elem}</MenuItem>;
            })}
          </Select>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "150px", marginTop: "20px" }}
            onClick={() => {
              setNotSelected(false);
            }}
          >
            Continue
          </Button>
        </Container>
      )}
      {!loading && error[0] && notSelected && (
        <Container maxWidth="false" p={10}>
          <Box m={10} style={{ fontSize: "20px" }}>
            <p style={{ fontSize: "50px", margin: 0 }}>Error</p>
            <p>{"Error Code: " + error[1].code}</p>
            {"Firebase Error: " + error[1].message}
          </Box>
        </Container>
      )}
      {!loading && !notSelected && <Answer user={student} teacher={user}/>}
    </React.Fragment>
  );
}
