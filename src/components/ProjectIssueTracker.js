import { faBug, faExchangeAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ProjectIssueTracker = ({features , bugs})=>{
    return (
        <div className="project-issue-tracker">
            <div className="issue-wrapper features">
                <h3>
                    <FontAwesomeIcon icon={faExchangeAlt}/>
                    Features
                </h3>
                <div className="issue-numbers-grid">
                    <div className="issue-numbers">
                        {features.total - features.closed}<i>OPEN</i>
                    </div>
                    <div className="issue-numbers">
                        {features.closed}<i>CLOSED</i>
                    </div>
                    <div className="issue-numbers features">
                        {features.total}<i>TOTAL</i>
                    </div>
                </div>
            </div>
            <div className="issue-wrapper bugs">
                <h3>
                    <FontAwesomeIcon icon={faBug}/>
                    Bugs
                </h3>
                <div className="issue-numbers-grid">
                    <div className="issue-numbers">
                        {bugs.total - bugs.closed}<i>OPEN</i>
                    </div>
                    <div className="issue-numbers">
                        {bugs.closed}<i>CLOSED</i>
                    </div>
                    <div className="issue-numbers">
                        {bugs.total}<i>TOTAL</i>
                    </div>
                </div>
            </div>
            <div className="buttons-grp">
                <button>View All Issues</button>
                <button>Summary</button>
            </div>
        </div>
    )
}

export default ProjectIssueTracker;