import { faCrown, faTerminal, faUsers } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const members = {
    managers : ['Alok Puri' , 'Alain Fernandes'],
    developers : ['Abhishek Jha' , 'Suresh S' , 'Naina Agarwal' , 'Raj Kush']
}

const ProjectMembers = (props)=>{
    return (
        <div className="project-members">
            <i><FontAwesomeIcon icon={faUsers}/></i>
            <h2>Members</h2>
            <div className="members-list managers">
                {members.managers.map((manager)=>{
                    return <a><FontAwesomeIcon icon={faCrown}/>{manager}</a>
                })}
            </div>
            <div className="members-list developers">
                {members.developers.map((developer)=>{
                    return <a><FontAwesomeIcon icon={faTerminal}/>{developer}</a>
                })}
            </div>
        </div>
    )
}

export default ProjectMembers;