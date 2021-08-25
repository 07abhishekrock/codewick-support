import { faCalendarWeek, faPenNib } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { returnStatusFromCode } from "./IssueContainer"


const IssueListItem = ({
    id,
    tracker,
    priority,
    subject, 
    Assignee,
    Reviewer,
    last_updated_date,
    progress
})=>{
    return (
        <div className="issue-list-item">
            <div className="issue-item-heading">
                <div className="left-wrapper">
                    <input type="checkbox" name={id+'-selected'} id={"issue#".concat(id)}/>
                    <label htmlFor={"issue#".concat(id)}></label>
                    <span id="issue-item-id">#{id}</span>
                    <i className="circle-seperator"></i>
                    <span id="issue-item-tracker" tracker_type={tracker}>
                        {tracker == "0" ? "Feature" : "Bug"}
                    </span>
                    <i className="circle-seperator"></i>
                    <span id="issue-item-priority" priority_type={priority}>
                        {priority == "0" ? "Normal" : "Urgent"}
                    </span>
                </div>
                <span id="issue-item-progress" status_type={progress}>
                    {returnStatusFromCode(progress)}
                </span>
            </div>
            <p>{subject}</p> 
            <div className="issue-bottom-wrapper">
                <div className="issue-item-footer-info">
                    <div className="issue-item-users">
                        <span>Assignee : <a>{Assignee || 'N/A'}</a></span>
                        <span>Reviewer : <a>{Reviewer || 'N/A'}</a></span>
                    </div>
                    <span><FontAwesomeIcon icon={faCalendarWeek}/>&nbsp;Last Updated On {last_updated_date}</span>
                </div>
                <div className="issue-item-options">
                    <a><FontAwesomeIcon icon={faPenNib}/>Edit Issue</a>
                    <a>View Issue</a>
                </div>
            </div>
        </div>
    )
}

export default IssueListItem;