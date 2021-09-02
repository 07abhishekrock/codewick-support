import { faCalendarWeek, faPenNib } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { returnStatusFromCode } from "./IssueContainer"


const IssueListItem = ({
    counter,
    tracker,
    priority,
    title, 
    assignee,
    reviewer,
    updatedAt,
    status,
    _id,
})=>{
    console.log(priority)
    return (
        <div className="issue-list-item">
            <div className="issue-item-heading">
                <div className="left-wrapper">
                    <input type="checkbox" name={counter+'-selected'} id={"issue#".concat(counter)}/>
                    <label htmlFor={"issue#".concat(counter)}></label>
                    <span id="issue-item-id">#{counter}</span>
                    <i className="circle-seperator"></i>
                    <span id="issue-item-tracker" tracker_type={tracker === "feature" ? "0" : "1"}>
                        {tracker == "feature" ? "Feature" : "Bug"}
                    </span>
                    <i className="circle-seperator"></i>
                    <span id="issue-item-priority" priority_type={priority === "high" ? "1" : "0"}>
                        {priority == "normal" ? "Normal" : "Urgent"}
                    </span>
                </div>
                <span id="issue-item-progress" status_type={returnStatusFromCode(status)}>
                    {status || "New"}
                </span>
            </div>
            <p>{title}</p> 
            <div className="issue-bottom-wrapper">
                <div className="issue-item-footer-info">
                    <div className="issue-item-users">
                        <span>Assignee : <a>{assignee && assignee.name || 'N/A'}</a></span>
                        <span>Reviewer : <a>{reviewer && reviewer.name || 'N/A'}</a></span>
                    </div>
                    <span><FontAwesomeIcon icon={faCalendarWeek}/>&nbsp;Last Updated On {(new Date(updatedAt)).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="issue-item-options">
                    <Link to={`../../issues/${_id}`}><FontAwesomeIcon icon={faPenNib}/>Edit Issue</Link>
                    <a>View Issue</a>
                </div>
            </div>
        </div>
    )
}

export default IssueListItem;