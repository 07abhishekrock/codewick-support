import NavbarWithSearch from './components/Navbar';
import IssuesContainer from './components/IssueContainer';
import ProjectWindowWithBackground, { ProjectPageContext } from './components/ProjectWindowBackground';
import './styles/main.scss';
import { HashRouter as Router , Redirect, Route , Switch } from 'react-router-dom';
import { useContext } from 'react';
import OverviewPage from './components/wrappers/OverviewPage';
import IssuesPage from './components/wrappers/IssuesPage';
import TimeLogsPage from './components/wrappers/TimeLogsPage';
import SingleIssuePage from './components/wrappers/SingleIssuePage';
import LoginContainer from './components/LoginContainer';


const SingleProjectPageWrapper = (props)=>{

  const projectName = useContext(ProjectPageContext);

  return (
    <>
      <div className="project-heading">
        <h1>{projectName}{props.appendToHeading}</h1>
        <span>{"A Simple Tagline comes here"}</span>
      </div>
      {props.children}
    </>
  )
}

function App() {
  return (
    <div className="App">
      <Router>
      <NavbarWithSearch/>
        <Switch>
          <Route exact path="/">
            <IssuesContainer/>
          </Route>
          <Route exact path="/login">
            <LoginContainer/>
          </Route>
          <Route exact path="/projects">
            <ProjectWindowWithBackground>
              <div className="project-heading">
                <h1>All Projects</h1>
                <span>All of your projects at one place</span>
              </div>
            </ProjectWindowWithBackground>
          </Route>
          <Route path="/issues">
            <ProjectWindowWithBackground>
              <Route exact path="/issues/:issue_id">
                <SingleIssuePage/>
              </Route>
            </ProjectWindowWithBackground>
          </Route>
          <Route path="/projects/:project_name">
            <ProjectWindowWithBackground>
                <Route exact path="/projects/:project_name">
                  <Redirect to="./overview"></Redirect>
                </Route>
                <Route exact path="/projects/:project_name/overview">
                  <OverviewPage/>
                </Route>
                <Route exact path="/projects/:project_name/issues">
                  <IssuesPage/>
                </Route>
                <Route exact path="/projects/:project_name/time_entries">
                  <TimeLogsPage/>
                </Route>
            </ProjectWindowWithBackground>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
