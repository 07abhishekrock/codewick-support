import { faCrown, faTerminal, faUsers } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ProjectMembers = ({members})=>{
    return (
        <div className="project-members">
            <i><FontAwesomeIcon icon={faUsers}/></i>
            <h2>Members</h2>
            <div className="members-list managers">
                {members.managers.map((manager)=>{
                    return <a key={manager._id}><FontAwesomeIcon icon={faCrown}/>{manager.name}</a>
                })}
            </div>
            <div className="members-list developers">
                {members.users.map((user)=>{
                    return <a key={user._id}><FontAwesomeIcon icon={faTerminal}/>{user.name}</a>
                })}
            </div>
        </div>
    )
}

export default ProjectMembers;