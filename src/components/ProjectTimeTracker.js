import { faClock } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ProjectTimeTracker = ()=>{
    return (
        <div className="project-time-tracker">
            <i><FontAwesomeIcon icon={faClock}/></i>
            <h3>Total Time Spent</h3>
            <h2>2 Days , 14 Hours</h2>
            <div className="buttons-grp">
                <button>Log Time</button>
                <button>Report</button>
                <button>Details</button>
            </div>
        </div>
    )
}

export default ProjectTimeTracker;