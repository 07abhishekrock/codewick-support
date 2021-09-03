import NavbarWithSearch from './components/Navbar';
import ProjectWindowWithBackground, { ProjectPageContext } from './components/ProjectWindowBackground';
import './styles/main.scss';
import { BrowserRouter as Router , Redirect, Route , Switch } from 'react-router-dom';
import { useEffect , useState , useReducer } from 'react';
import OverviewPage from './components/wrappers/OverviewPage';
import IssuesPage from './components/wrappers/IssuesPage';
import TimeLogsPage from './components/wrappers/TimeLogsPage';
import SingleIssuePage from './components/wrappers/SingleIssuePage';
import LoginContainer from './components/LoginContainer';
import UserProfilePage from './components/UserProfilePage';
import AllProjectsWrapper from './components/wrappers/AllProjectsWrapper';
import AdminPageWrapper from './components/wrappers/AdminPageWrapper';
import React from 'react';
import { LoadingContext } from './utils/contexts';
import LoadingModal from './components/LoadingModal';

const HomePageGrid = (user)=>{
  console.log(user);
  return(
    <div className="homepage-grid">
        <IssuesPage key={"createdBy"} createdByUserId={user.user && user.user._id}/>
        <IssuesPage key={"assignedBy"} assignedByUserId={user.user && user.user._id}/>
    </div>
  )
}


function App() {
  const [user_found , set_user_found] = useState(null);
  const [load_object , dispatch_load_object] = useReducer((state , action_object)=>{
    const [action , payload] = action_object;
    switch(action){
      case 'idle' : return {
        loading : 'idle',
        error : null,
        loadingText : '',
        retryCallback : null
      }
      case 'load' : return {
        loading : 'load',
        error : null,
        loadingText : payload,
        retryCallback : null
      }
      case 'error' : return {
        loading : 'idle',
        error : payload.error,
        loadingText : '',
        retryCallback : payload.onRetry
      }
      case 'info' : return {
        loading : 'info',
        error : null,
        loadingText : payload,
        retryCallback : null 
      }
    }
  },{
    loading : 'idle',
    error : null,
    loadingText : 'not loading yet',
    retryCallback : null
  })

  useEffect(async ()=>{
      try{
        const token = localStorage.getItem('token');
        const user_object = JSON.parse(localStorage.getItem('user')); 
        if(token && user_object._id){
          dispatch_load_object(['load','Loading User']);
          const response = await fetch('https://api-redmine.herokuapp.com/api/v1/user?id=' + user_object._id , {
            headers : {
              'Authorization' : 'Bearer ' + localStorage.getItem('token')
            }
          });
          if(response.ok){
            set_user_found(user_object);
          }
        }
        else{
          set_user_found(null);
        }
      }
      catch(e){
        set_user_found(null);
      }
      finally{
        dispatch_load_object(['idle']);
      }
  },[])

  return (
    <div className="App">
        <Router>
        <LoadingContext.Provider value={[load_object , dispatch_load_object]}>
        <LoadingModal {...{load_object , dispatch_load_object}}/>
          <Switch>
            <Route exact path="/login">
              {!(user_found && user_found._id) ? <LoginContainer {...{set_user_found}}/> : <Redirect to="/"></Redirect>}
            </Route>
            <Route path="/">
              {!(user_found && user_found._id) ? <Redirect to="/login"></Redirect> : <>
              <NavbarWithSearch/>
              <Route exact path="/">
                <HomePageGrid user={user_found}>
                </HomePageGrid>
              </Route>
              <Route exact path="/profile">
                <UserProfilePage/>
              </Route>
              <Route exact path="/projects">
                <ProjectWindowWithBackground>
                  <div className="project-heading">
                    <h1>All Projects</h1>
                    <span>All of your projects at one place</span>
                  </div>
                  <AllProjectsWrapper/>
                </ProjectWindowWithBackground>
              </Route>
              <Route path="/issues">
                <ProjectWindowWithBackground>
                  <Route exact path="/issues">
                    <IssuesPage/>
                  </Route>
                  <Route exact path="/issues/:issue_id">
                    <SingleIssuePage/>
                  </Route>
                  <Route exact path="/issues/:issue_id/time_entries">
                    <TimeLogsPage/>
                  </Route>
                </ProjectWindowWithBackground>
              </Route>
              <Route path="/admin">
                <ProjectWindowWithBackground>
                  <div className="project-heading">
                    <h1>Admin Page</h1>
                    <span>Create Issues , Projects and Add Users</span>
                  </div>
                  <AdminPageWrapper/>
                </ProjectWindowWithBackground>
              </Route>
              <Route path="/project/:project_name">
                <ProjectWindowWithBackground>
                    <Route exact path="/project/:project_name">
                      <Redirect to="./overview"></Redirect>
                    </Route>
                    <Route exact path="/project/:project_name/overview">
                      <OverviewPage/>
                    </Route>
                    <Route exact path="/project/:project_name/issues">
                      <IssuesPage/>
                    </Route>
                </ProjectWindowWithBackground>
              </Route>
              </>}
            </Route>
          </Switch>
        </LoadingContext.Provider>
        </Router>
    </div>
  );
}

export default App;
