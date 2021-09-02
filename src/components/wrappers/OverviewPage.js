import ProjectIssueTracker from '../ProjectIssueTracker';
import ProjectTimeTracker from '../ProjectTimeTracker';
import ProjectMembers from '../ProjectMembers';
import { useParams } from 'react-router';
import { useFetch } from '../../utils/hooks';
import { useContext , useState } from 'react';
import { LoadingContext } from '../../utils/contexts';
const OverviewPage = () => {
    const {project_name : project_id} = useParams();
    const [,dispatch_load_object] = useContext(LoadingContext);
    const [issues_count , set_issues_count] = useState({
        features : {total : 0 , closed : 0},
        bugs : {total : 0 , closed : 0}
    });
    const [project_data, set_project_data] = useState({});
    const [members , set_members] = useState({
        managers : [],
        users : []
    })
    useFetch('https://api-redmine.herokuapp.com/api/v1/project/'+project_id , 'GET',true , {},
    ()=>{
        dispatch_load_object(['load','Loading Your Project !!']);
    },
    (data)=>{
        const project_data = data.data.data;
        console.log(project_data);
        set_project_data(project_data);
        set_issues_count({
            features : {total : project_data.totalFeature , closed : project_data.closedFeatures || 0},
            bugs : {total : project_data.totalBug , closed : project_data.closedBug || 0}
        })
        set_members({
            users : project_data.user || [],
            managers : project_data.manager || [] 
        })
        dispatch_load_object(['idle']);
    }, 
    (error)=>{
        dispatch_load_object(['error',{
            error,
            onRetry : ()=>console.log('we can retry here')
        }])
    } 
    )
    return (
        <>
            <div className="project-heading">
                <h1>{project_data.title || 'N/A'} / Overview</h1>
                <span>{project_data.description || 'No Description Provided'}</span>
            </div>
            <div className="project-overview-grid">
                <ProjectIssueTracker features={issues_count.features} bugs={issues_count.bugs} />
                <ProjectTimeTracker totalTimeSpent={project_data.totalTimeSpent} />
                <ProjectMembers members={members}/>
            </div>
        </>
    )
}

export default OverviewPage;