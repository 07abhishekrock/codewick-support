import { faClock } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ProjectTimeTracker = ({ totalTimeSpent })=>{
    const hours = totalTimeSpent ? Math.floor(totalTimeSpent) : 0;
    const minutes = totalTimeSpent ? Math.trunc((totalTimeSpent - Math.floor(totalTimeSpent)) * 60) : 0
    return (
        <div className="project-time-tracker">
            <i><FontAwesomeIcon icon={faClock}/></i>
            <h3>Total Time Spent</h3>
            <h2>{hours} Hours , {minutes} Minutes</h2>
        </div>
    )
}

export default ProjectTimeTracker;