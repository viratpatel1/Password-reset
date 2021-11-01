import './App.css';
import { Signin, Signup, Navbar, ResetPassword, ForgetPassword } from './componends/Signin.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import Signup from "./componends/Signin";

function App()
{
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Signin} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/resetpassword" component={ForgetPassword} />
          <Route exact path="/reset/:token" component={ResetPassword} />
        </Switch>
      </Router>
      {/* Work */}
      {/* <Navbar /> */}
      {/* <Signin /> */}
      {/* <Signup /> */}
    </div>
  );
}

export default App;
