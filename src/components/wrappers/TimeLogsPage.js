import { useContext, useState } from 'react';
import { LoadingContext } from '../../utils/contexts';
import { useFetch } from '../../utils/hooks';
import TimeLogsWrapper from '../TimeLogsWrapper';
import { useParams } from 'react-router';

export default function TimeLogsPage() {
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const {issue_id} = useParams();
    const [issue_data , set_issue_data] = useState({});
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
            </div>
            <TimeLogsWrapper issue_id={issue_id}/> 
        </>
    )
}
