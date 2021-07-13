
import {
  BrowserRouter as Router,
  Switch,
  Route,
  
} from "react-router-dom";
import TeacherHomepage from "./TeacherHomePage";
import TeacherLogin from './TeacherLoginPage';

export default function App() {
  return (
    <Router>
    
        <Switch>
        <Route  path="/home" component={TeacherHomepage}/>
           
          <Route exact path="/">
            <TeacherLogin />
          </Route>
       
       
        </Switch>
      
    </Router>
  );
}

// export default App;
