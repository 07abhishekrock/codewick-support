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
import { LoadingContext , UserContext } from './utils/contexts';
import LoadingModal from './components/LoadingModal';




const HomePageGrid = ({user})=>{
  return(
    <div className="homepage-grid">
        {user && user.role !== 'customer' ? <IssuesPage key={"assignedBy"} assignedByUserId={user && user._id}/> : null}
        <IssuesPage key={"createdBy"} createdByUserId={user && user._id}/>
    </div>
  )
}

const safe_JSONParse = (json_string)=>{
  try{
    const json_data = JSON.parse(json_string);
    return json_data;
  }
  catch(e){
    return null;
  }
}


function App() {
  const [user_found , set_user_found] = useState(safe_JSONParse(localStorage.getItem('user')));
  const [load_object , dispatch_load_object] = useReducer((state , action_object)=>{
    const [action , payload] = action_object;
    switch(action){
      case 'idle' : return {
        loading : 'idle',
        error : null,
        loadingText : '',
        retryCallback : null,
        buttonText : null,
        buttonCallback : null,
      }
      case 'load' : return {
        loading : 'load',
        error : null,
        loadingText : payload,
        retryCallback : null,
        buttonText : null,
        buttonCallback : null
      }
      case 'error' : return {
        loading : 'idle',
        error : payload.error,
        loadingText : '',
        retryCallback : payload.onRetry,
        buttonText : payload.buttonText,
        buttonCallback : payload.buttonCallback
      }
      case 'info' : return {
        loading : 'info',
        error : null,
        loadingText : payload,
        retryCallback : null ,
        buttonText : null,
        buttonCallback : null
      }
    }
  },{
    loading : 'idle',
    error : null,
    loadingText : 'not loading yet',
    retryCallback : null,
    buttonCallback : null,
    buttonText : null
  })

  useEffect(async ()=>{
      try{
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('made response with success');
        if(token && user._id){
          console.log('hello world');
          // dispatch_load_object(['load','Loading User']);
          const response = await fetch('https://api-redmine.herokuapp.com/api/v1/user/' + user._id , {
            headers : {
              'Authorization' : 'Bearer ' + localStorage.getItem('token')
            }
          });
          if(response.ok){
            const response_object = await response.json();
            set_user_found(response_object.data.data);
            localStorage.setItem('user',JSON.stringify(response_object.data.data));
          }
          else{
            set_user_found(null);
            localStorage.removeItem('user');
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
        // dispatch_load_object(['idle']);
      }
  },[])

  return (
    <div className="App">
        <Router>
        <UserContext.Provider value={[user_found , set_user_found]}>
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
        </UserContext.Provider>
        </Router>
    </div>
  );
}

export default App;
