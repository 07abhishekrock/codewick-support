import GeneralList from "./GeneralList";
import IssueListItem from "./IssueListItem";


const IssuesListWrapper = ({all_issues , set_all_issues})=>{
    
    return(
        <GeneralList heading="Issues">
            {all_issues.map((issue)=>{
                return <IssueListItem key={issue._id} {...issue}/>
            })}
        </GeneralList>
    )
}

export default IssuesListWrapper;