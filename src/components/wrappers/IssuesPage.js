import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle as faPlus } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { useParams } from "react-router";
import { LoadingContext } from "../../utils/contexts";
import { useFetch } from "../../utils/hooks";
import CreateNewIssueForm from "../CreateNewIssueForm";
import IssuesListWrapper from "../IssuesListWrapper"

function IssuesPage() {

    const {project_name : project_id} = useParams();
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const [projects , set_projects] = useState([]);
    const [current_project_data , set_current_project_data] = useState();
    const [view_new_issue_dialog , set_view_new_issue_dialog] = useState();
    const [all_issues , set_all_issues] = useState([]);
    const user_id = JSON.parse(localStorage.getItem('user'))._id;

    const addNewIssue = (issue_obj) => {
        set_all_issues([issue_obj , ...all_issues])
    }


    useFetch('https://api-redmine.herokuapp.com/api/v1/project/'+project_id,'GET',true,{},
        ()=>{
            dispatch_load_obj(['load','Setting Up !!!']);   
        },  
        (data)=>{
            dispatch_load_obj(['idle']);
            set_current_project_data(data.data.data);
        },
        (error)=>{
            dispatch_load_obj(['error',{
                error,
                onRetry : ()=>{}
            }]);
        },
        project_id === undefined ? null : project_id
    )
    useFetch('https://api-redmine.herokuapp.com/api/v1/project?user='+user_id,'GET',true,{},
        ()=>{
            dispatch_load_obj(['load','Adding Projects...'])
        },
        (data)=>{
            const projects_list = data.data.data;
            set_projects(projects_list);
            dispatch_load_obj(['idle']);
        },
        (error)=>{
            dispatch_load_obj(['error',{
                error,
                onRetry : ()=>{}
            }])
        }
    )
    useFetch('https://api-redmine.herokuapp.com/api/v1/issue?project=' + project_id , 'GET' , true , {} , 
    ()=>{
        dispatch_load_obj(['load' , 'Getting All Issues']);
    }, 
    (data)=>{
        const issues_list = data.data.data;
        set_all_issues(issues_list);
        dispatch_load_obj(['idle']);
    },
    (error)=>{
        console.log(error);
        dispatch_load_obj(['error' , {
            error,
            onRetry : ()=>console.log('retry now')
        }])
    }
    
    ,project_id === undefined ? null : project_id)
    useFetch('https://api-redmine.herokuapp.com/api/v1/issue?user=' + user_id , 'GET' , true , {} , 
    ()=>{
        dispatch_load_obj(['load' , 'Getting All Issues']);
    }, 
    (data)=>{
        const issues_list = data.data.data;
        console.log(issues_list);
        set_all_issues(issues_list);
        dispatch_load_obj(['idle']);
    },
    (error)=>{
        dispatch_load_obj(['error' , {
            error,
            onRetry : ()=>console.log('retry now')
        }])
    }
    
    ,project_id ? null : project_id)

    return (
        <>
            <div className="project-heading">
                {!project_id ? <h1>All Issues</h1> : 
                    <h1>{current_project_data && current_project_data.title || 'Loading..'} / Issues</h1>
                }
                <button onClick={set_view_new_issue_dialog.bind(null , 1)}>Add New Issue &nbsp; <FontAwesomeIcon icon={faPlus}/></button>
            </div>
            {view_new_issue_dialog ? <CreateNewIssueForm addNewIssue={addNewIssue} toggleDialog={set_view_new_issue_dialog} projects_array={projects} showCombo={project_id ? false : true}/> : null}
            <IssuesListWrapper {...{all_issues}}/>
        </>
    )
}

export default IssuesPage
