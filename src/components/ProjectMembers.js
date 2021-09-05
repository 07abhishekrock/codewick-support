import { faCrown, faTerminal, faUsers } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


const ProjectMembers = ({members})=>{
    const checkUserIsManager = (user_object)=>{
        const isFound = members.managers.filter((manager)=>{
            return (manager._id === user_object._id);
        })
        return Boolean(isFound.length);
    }
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
                    if(!checkUserIsManager(user)){
                        return <a key={user._id}><FontAwesomeIcon icon={faTerminal}/>{user.name}</a>
                    }
                })}
            </div>
        </div>
    )
}

export default ProjectMembers;