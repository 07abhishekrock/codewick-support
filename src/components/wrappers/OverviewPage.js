import ProjectIssueTracker from '../ProjectIssueTracker';
import ProjectTimeTracker from '../ProjectTimeTracker';
import ProjectMembers from '../ProjectMembers';
const OverviewPage = () => {
    return (
        <>
            <div className="project-heading">
                <h1>Codewick Common / Overview</h1>
                <span>Common Work for all Projects</span>
            </div>
            <div className="project-overview-grid">
                <ProjectIssueTracker />
                <ProjectTimeTracker />
                <ProjectMembers />
            </div>
        </>
    )
}

export default OverviewPage;