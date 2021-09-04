import React, { useEffect , useState , useContext } from 'react'
import { Link } from 'react-router-dom'
import { LoadingContext, UserContext } from '../../utils/contexts';
import {useFetch} from '../../utils/hooks';

function SingleProject({
    title,
    description,
    id
}){
    return (
        <Link to={`./project/${id}/`} className="single-project">
            <h2>{title}</h2>
            <span>{description || 'No Description Provided'}</span>
        </Link>
    )
}

function AllProjectsWrapper() {
    const user_id = useContext(UserContext)[0]._id;
    const [user_object] = useContext(UserContext);
    const [all_projects , set_all_projects] = useState([]);
    const [,dispatch_load_object] = useContext(LoadingContext); 
    useFetch(`https://api-redmine.herokuapp.com/api/v1/project/my-project`,'GET',true,{},
    ()=>{
        dispatch_load_object(['load',"Loading All Projects"]);
    }
    ,
    (resp)=>{
        set_all_projects(resp.data && resp.data.data);
        dispatch_load_object(['idle']);
    },
    (error)=>{
        console.log('error occurred')
        dispatch_load_object(['error' , {
            error,
            onRetry : ()=>{
                console.log('can retry now');
            }
        }])
    },user_object.role === 'admin' ? null : true);
    useFetch(`https://api-redmine.herokuapp.com/api/v1/project`,'GET',true,{},
    ()=>{
        dispatch_load_object(['load',"Loading All Projects"]);
    }
    ,
    (resp)=>{
        set_all_projects(resp.data && resp.data.data);
        dispatch_load_object(['idle']);
    },
    (error)=>{
        console.log('error occurred')
        dispatch_load_object(['error' , {
            error,
            onRetry : ()=>{
                console.log('can retry now');
            }
        }])
    },user_object.role !== 'admin' ? null : true);
    return (
        <div className="all-projects-grid">
            {all_projects && all_projects.length === 0 ? <SingleProject title="No Projects Found" slug="Create A New Project"/> : null}
            {all_projects && all_projects.map((project)=>{
                return (
                    <SingleProject {...project} key={project.id} id={project.id}/>
                )
            })}
        </div>
    )
}

export default AllProjectsWrapper
