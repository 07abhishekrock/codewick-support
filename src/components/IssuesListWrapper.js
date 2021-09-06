import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GeneralList from "./GeneralList";
import IssueListItem from "./IssueListItem";

const EmptyIssueItem = ()=>{
    return <div className="issue-list-item"  style={{textAlign : "center"}}>
                <h1 style={{marginBottom : '0' , fontSize : '3.2em'}}><FontAwesomeIcon icon={faBoxOpen}/></h1>
                <h1>No More Issues Found</h1>
            </div>
}

const options = {
    search_options : [
        {
            label : 'ID',
            value : 'counter'
        },
        {
            label : 'Title',
            value : 'title'
        }
    ],
    filter_options : [
        {
            label : 'Open Issues',
            value : 'status[ne]=closed'
        },
        {
            label : 'Closed Issues',
            value : 'status=closed'
        },
        {
            label : 'Resolved Issues',
            value : 'status=resolved'
        },
        {
            label : 'New Issues',
            value : 'status=new'
        },
        {
            label : 'Progress Issues',
            value : 'status=inProgress'
        },
        {
            label : 'Review Issues',
            value : 'status=codeReview'
        },
    ]
}


const IssuesListWrapper = ({all_issues , onNext , onPrev , search_query , set_search_query , newHeading})=>{
    
    return(
        <GeneralList heading={newHeading() || "Issues"} onNext={onNext} onPrev={onPrev} search_query={search_query} set_search_query={set_search_query} options={options}>
            {all_issues.map((issue)=>{
                return <IssueListItem key={issue._id} {...issue}/>
            })}
            {all_issues.length === 0 ? <EmptyIssueItem key="empty-issue-item"/> : null}
        </GeneralList>
    )
}

export default IssuesListWrapper;