import { useContext, useState } from 'react';
import { LoadingContext, UserContext } from '../../utils/contexts';
import { useFetch } from '../../utils/hooks';
import TimeLogsWrapper from '../TimeLogsWrapper';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import CreateTimeLogForm from '../CreateTimeLogForm';

export default function TimeLogsPage() {
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const {issue_id} = useParams();
    const [issue_data , set_issue_data] = useState({});
    const [create_log , show_create_log] = useState(false);
    const [time_logs_data, set_time_logs_data] = useState([]);
    const [current_user] = useContext(UserContext);
    useFetch('https://api-redmine.herokuapp.com/api/v1/issue/' + issue_id , 'GET' , true , {}, 
    ()=>{
        dispatch_load_obj(['load',"Loading Project"]);
    },
    (data)=>{
        set_issue_data(data.data.data);
        dispatch_load_obj(['idle']);
    },
    (error)=>{
        dispatch_load_obj(['error',{
            error,
            onRetry : ()=>{console.log('retry')}
        }])
    },
    issue_id || null
    )
    return (
        <>
            <div className="project-heading">
                <h1>{issue_data.project && issue_data.project.title || 'N/A'} / Time Logs</h1>
                <span>Time Logs for #{issue_data.counter || 'N/A'}</span>
                <button onClick={() => show_create_log(true)}>Add Time Log &nbsp;<FontAwesomeIcon icon={faPlusCircle}/></button>
            </div>
            {create_log ? <CreateTimeLogForm issue_id={issue_data._id} project_id={issue_data.project && issue_data.project._id} show_create_log={show_create_log} 
            updateLogsList={(new_log_object)=>{
                console.log(new_log_object.created_at);
                const formatted_log_object = {
                    activity : new_log_object.activity,
                    comment : new_log_object.comment,
                    hours : new_log_object.hours,
                    id : new_log_object.id,
                    issue : issue_data,
                    createdAt : new_log_object.createdAt,
                    user : current_user 
                }
                set_time_logs_data([formatted_log_object , ...time_logs_data]);
            }}/> : false}
            <TimeLogsWrapper issue_id={issue_id} time_logs_data={time_logs_data} set_time_logs_data={set_time_logs_data}/> 
        </>
    )
}
