import { faClock, faPenAlt } from "@fortawesome/free-solid-svg-icons"
import { faTrashAlt as faTrash } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import GeneralList from "./GeneralList"

export const TimeLogSingle = ({
    username,
    timeTaken,
    workType,
    date,
    IssueId,
    IssueSubject,
    comment
})=>{
    return (
        <div className="time-log-single">
            <div className="time-log-clock">
                <FontAwesomeIcon icon={faClock}/>
                <span className="total-time-taken">2:40 Hrs</span>
                <span className="work-type">Development</span>
            </div>
            <div className="time-log-info-wrapper">
                <div className="time-log-info">
                    <h3><a>You</a> worked on Issue #1234 on <a>24 Aug 2021</a></h3>
                    <p>Add Employee List to user database and add functions of edit and delete.</p>
                    <div className="comment">
                    Completed all sections, responsive remaining
                    </div>
                </div>
                <div className="time-log-options">
                    <i><FontAwesomeIcon icon={faPenAlt}/></i>
                    <i><FontAwesomeIcon icon={faTrash}/></i>
                </div>
            </div>
        </div>
    )
}


const TimeLogsWrapper = (props)=>{
    return (
        <GeneralList no_search_bar heading={"Time Logs"}>
            <TimeLogSingle/>
            <TimeLogSingle/>
            <TimeLogSingle/>
            <TimeLogSingle/>
            <TimeLogSingle/>
            <TimeLogSingle/>
        </GeneralList>
    )
}


export default TimeLogsWrapper;