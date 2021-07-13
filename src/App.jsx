
import {
  BrowserRouter as Router,
  Switch,
  Route,
  
} from "react-router-dom";
import Dashboard from "./DashBoard";
import TeacherHomepage from "./TeacherHomePage";
import TeacherLogin from './TeacherLoginPage';

export default function App() {
  return (
    <Router>
    
        <Switch>
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
