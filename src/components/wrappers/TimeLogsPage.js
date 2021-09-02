import { useContext, useState } from 'react';
import { LoadingContext } from '../../utils/contexts';
import { useFetch } from '../../utils/hooks';
import TimeLogsWrapper from '../TimeLogsWrapper';
import { useParams } from 'react-router';

export default function TimeLogsPage() {
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const {project_name : project_id} = useParams();
    const [project_data , set_project_data] = useState({});
    useFetch('https://api-redmine.herokuapp.com/api/v1/project/' + project_id , 'GET' , true , {}, 
    ()=>{
        dispatch_load_obj(['load',"Loading Project"]);
    },
    (data)=>{
        set_project_data(data.data.data);
        dispatch_load_obj(['idle']);
    },
    (error)=>{
        dispatch_load_obj(['error',{
            error,
            onRetry : ()=>{console.log('retry')}
        }])
    },
    project_id || null
    )
    return (
        <>
            <div className="project-heading">
                <h1>{project_data.title || 'N/A'} / Time Logs</h1>
                <span>{project_data.description || 'No description Provided'}</span>
            </div>
            <TimeLogsWrapper/> 
        </>
    )
}
