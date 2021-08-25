import { faEdit, faPencilAlt, faPenFancy, faPenNib } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const __NEW__ = 1;
export const __RESOLVED__ = 0;
export const __CODE_IN_REVIEW__ = 2;
export const __CLOSED__ = 3;
export const __IN_PROGRESS__ = 4;
export const __TRACKER_FEATURE__ = 0;
export const __TRACKER_BUG__ = 1;

export function returnStatusFromCode(status_index){
    switch(status_index){
        case __NEW__ : return "New";
        case __RESOLVED__ : return "Resolved";
        case __CODE_IN_REVIEW__ : return 'Code Review';
        case __CLOSED__ : return 'Closed';
        case __IN_PROGRESS__ : return 'In Progress';
        default : return 'Invalid'
    }
}

const sample_issue = {
    issue_id : '1230',
    issue_tracker : __TRACKER_FEATURE__,
    project_name : 'Project Name',
    subject : 'Add exception handling in Project List and Container',
    issue_status : __RESOLVED__
};
const sample_issue_1 = {
    issue_id : '1231',
    issue_tracker : __TRACKER_BUG__,
    project_name : 'Pysource',
    subject : 'Add Employee Display to the dashboard and fix all errors.',
    issue_status : __CODE_IN_REVIEW__
};
const sample_issue_2 = {
    issue_id : '1232',
    issue_tracker : __TRACKER_BUG__,
    project_name : 'Codewick Common',
    subject : 'Create new frames and designs for dashboard and issues page',
    issue_status : __NEW__
};
const sample_issue_3 = {
    issue_id : '1233',
    issue_tracker : __TRACKER_FEATURE__,
    project_name : 'Codewick Common',
    subject : 'Add new Issues page and other details to main page and add projects too.',
    issue_status : __CLOSED__
};
const sample_issue_4 = {
    issue_id : '1234',
    issue_tracker : __TRACKER_FEATURE__,
    project_name : 'Parameshwar',
    subject : 'Add tabs to all videos display , bhajan , arti and live',
    issue_status : __IN_PROGRESS__
};


const IssueItem = ({
    issue_id , issue_tracker , issue_status , subject , project_name
})=>{
    return (
        <div className="issue-item">
            <div className="issue-heading">
                <div className="issue-id-feature">
                    <span id="issue-id">#{issue_id}</span>
                    <i className="circle-seperator"></i>
                    <span id="issue-tracker" tracker_type={issue_tracker}>{issue_tracker === 0 ? "Feature" : "Bug"}</span>
                </div>
                <span status_type={issue_status}>
                    {returnStatusFromCode(issue_status)}
                </span>
            </div>

            <div className="issue-main-wrapper">
                <div className="issue-info">
                    <p>{subject}</p>
                    <span>in <b>{project_name}</b></span>
                </div>
                <div className="issue-options">
                    <span><FontAwesomeIcon icon={faPenFancy}/></span>
                </div>
            </div>

        </div>
    )
}


const IssueContainer = ()=>{
    return (
        <div className="issues-container">
            <h2>Issues <i>All Issues</i></h2>
            <div className="issues-list">
                <IssueItem {...sample_issue}/>
                <IssueItem {...sample_issue_1}/>
                <IssueItem {...sample_issue_2}/>
                <IssueItem {...sample_issue_3}/>
                <IssueItem {...sample_issue_4}/>
            </div>
        </div>
    )
}
export default IssueContainer;