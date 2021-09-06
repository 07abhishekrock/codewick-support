import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle as faPlus } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { LoadingContext, UserContext } from "../../utils/contexts";
import { useFetch } from "../../utils/hooks";
import CreateNewIssueForm from "../CreateNewIssueForm";
import IssuesListWrapper from "../IssuesListWrapper"
const LIMIT = 10;


function IssuesPage({ createdByUserId, assignedByUserId }) {

    const { project_name: project_id } = useParams();
    const [, dispatch_load_obj] = useContext(LoadingContext);
    const [view_new_issue_dialog, set_view_new_issue_dialog] = useState();
    const [all_issues, set_all_issues] = useState([]);
    const [current_project_data, set_current_project_data] = useState({});
    const user_id = useContext(UserContext)[0]._id;
    const [user_object] = useContext(UserContext);

    const [current_page, set_current_page] = useState(1);
    const [search_query, set_search_query] = useState('');

    const addNewIssue = (issue_obj) => {
        set_all_issues([issue_obj, ...all_issues])
    }

        useFetch(`https://api-redmine.herokuapp.com/api/v1/issue?${search_query}&limit=${LIMIT}&page=${current_page}&project=` + project_id, 'GET', true, {},
        () => {
            dispatch_load_obj(['load', 'Getting All Issues']);
        },
        (data) => {
            const issues_list = data.data.data;
            set_all_issues(issues_list);
            dispatch_load_obj(['idle']);
        },
        (error) => {
            console.log(error);
            dispatch_load_obj(['error', {
                error,
                onRetry: () => console.log('retry now')
            }])
        }

        , project_id === undefined || search_query === '' ? null : project_id)
        useFetch('https://api-redmine.herokuapp.com/api/v1/issue?user=' + user_id, 'GET', true, {},
        () => {
            dispatch_load_obj(['load', 'Getting All Issues']);
        },
        (data) => {
            const issues_list = data.data.data;
            console.log(issues_list);
            set_all_issues(issues_list);
            dispatch_load_obj(['idle']);
        },
        (error) => {
            dispatch_load_obj(['error', {
                error,
                onRetry: () => console.log('retry now')
            }])
        }

        , project_id || createdByUserId || assignedByUserId ? null : project_id)

        useFetch('https://api-redmine.herokuapp.com/api/v1/project/' + project_id, 'GET', true, {},
        () => {
            dispatch_load_obj(['load', 'Setting Up !!!']);
        },
        (data) => {
            dispatch_load_obj(['idle']);
            set_current_project_data(data.data.data);
        },
        (error) => {
            dispatch_load_obj(['error', {
                error,
                onRetry: () => { }
            }]);
        },
        project_id === undefined ? null : project_id
        , !project_id || user_object.role !== 'admin' ? null : true)
        useFetch('https://api-redmine.herokuapp.com/api/v1/project/my-project?_id=' + project_id, 'GET', true, {},
        () => {
            console.log('loading single project');
            dispatch_load_obj(['load', 'Adding Projects...'])
        },
        (data) => {
            set_current_project_data(data.data.data[0]);
            dispatch_load_obj(['idle']);
        },
        (error) => {
            dispatch_load_obj(['error', {
                error,
                onRetry: () => { }
            }])
        }
        , !project_id || user_object.role === 'admin' ? null : true)



    useFetch(`https://api-redmine.herokuapp.com/api/v1/issue?createdBy=${createdByUserId}&${search_query}&limit=${LIMIT}&page=${current_page}`, 'GET', true, {},
        () => {
            dispatch_load_obj(['load', 'Getting All Issues']);
        },
        (data) => {
            const issues_list = data.data.data;
            set_all_issues(issues_list);
            dispatch_load_obj(['idle']);
        },
        (error) => {
            console.log(error);
            dispatch_load_obj(['error', {
                error,
                onRetry: () => console.log('retry now')
            }])
        }

        , project_id || search_query === '' || createdByUserId === undefined ? null : createdByUserId)
    useFetch(`https://api-redmine.herokuapp.com/api/v1/issue?assignee=${assignedByUserId}&${search_query}&limit=${LIMIT}&page=${current_page}`, 'GET', true, {},
        () => {
            dispatch_load_obj(['load', 'Getting All Issues']);
        },
        (data) => {
            const issues_list = data.data.data;
            set_all_issues(issues_list);
            dispatch_load_obj(['idle']);
        },
        (error) => {
            console.log(error);
            dispatch_load_obj(['error', {
                error,
                onRetry: () => console.log('retry now')
            }])
        }

        , project_id || search_query === '' || assignedByUserId === undefined ? null : assignedByUserId)

    return (
        <>
            {createdByUserId || assignedByUserId ? null :
                <>
                    <div className="project-heading">
                        {!project_id ? <h1>All Issues</h1> :
                            <h1>{current_project_data && current_project_data.title || 'Loading..'} / Issues</h1>
                        }
                        <button onClick={set_view_new_issue_dialog.bind(null, 1)}>Add New Issue &nbsp; <FontAwesomeIcon icon={faPlus} /></button>
                    </div>
                    {view_new_issue_dialog ? <CreateNewIssueForm addNewIssue={addNewIssue} toggleDialog={set_view_new_issue_dialog} showCombo={project_id ? false : true} current_project_data={current_project_data} /> : null}
                </>
            }
            <IssuesListWrapper {...{ all_issues }}
                search_query={search_query}
                set_search_query={set_search_query}
                onNext={() => {
                    if (all_issues.length === LIMIT) {
                        set_current_page(current_page + 1);
                    }
                }}
                onPrev={() => {
                    if (current_page > 1) {
                        set_current_page(current_page - 1);
                    }
                }}
                newHeading={() => {
                    if (createdByUserId) return "Created By You"
                    else if (assignedByUserId) return "Assigned To You"
                }}

            />
        </>
    )
}

export default IssuesPage
