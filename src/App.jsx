
import {
  BrowserRouter as Router,
  Switch,
  Route,
  
} from "react-router-dom";
import Dashboard from "./DashBoard";
// import Student from "./Student";
import TeacherHomepage from "./TeacherHomePage";
import TeacherLogin from './TeacherLoginPage';

export default function App() {
  return (
    <Router>
    
        <Switch>
        {/* <Route  path="/student/:id" component={Student}/> */}

        <Route  path="/home" component={TeacherHomepage}/>
        <Route  path="/dashboard" component={Dashboard}/>
          <Route exact path="/">
            <TeacherLogin />
          </Route>
       
       
        </Switch>
      
    </Router>
  );
}

// export default App;
