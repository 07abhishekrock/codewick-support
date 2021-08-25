import GeneralList from "./GeneralList";
import IssueListItem from "./IssueListItem";
const __TRACKER_FEATURE__ = 0;
const __TRACKER_BUG__ = 1;

const __NORMAL_PRIORITY__ = 0;
const __URGENT_PRIORITY__ = 1;

const __NEW__ = 1;
const __RESOLVED__ = 0;
const __CODE_IN_REVIEW__ = 2;
const __CLOSED__ = 3;
const __IN_PROGRESS__ = 4;

const IssuesListWrapper = ()=>{
    const issues = [
        {
            id : '1234',
            tracker : __TRACKER_FEATURE__,
            priority : __NORMAL_PRIORITY__,
            subject : 'Add All Issues Section to the dashboard of Codewick support homepage',
            Assignee : 'Alok Puri',
            Reviewer : 'Abhishek Jha',
            last_updated_date : '23 Aug 2020',
            progress : __NEW__,
        },
        {
            id : '1235',
            tracker : __TRACKER_BUG__,
            priority : __URGENT_PRIORITY__,
            subject : 'Image zoom not working in dashboard image view section. Immediate Fix required.',
            Assignee : 'Alok Puri',
            Reviewer : 'Naina S',
            last_updated_date : '22 Aug 2020',
            progress : __IN_PROGRESS__,
        },
        {
            id : '1236',
            tracker : __TRACKER_FEATURE__,
            priority : __URGENT_PRIORITY__,
            subject : 'Add Icons to dashboard self to bring more appeal to the site and also improve website accessibility.',
            Assignee : 'Alok Puri',
            Reviewer : 'Suresh K',
            last_updated_date : '21 Sep 2020',
            progress : __RESOLVED__,
        },
        {
            id : '1237',
            tracker : __TRACKER_FEATURE__,
            priority : __URGENT_PRIORITY__,
            subject : 'Add New Page for showing all projects, sidebar does not work for a long list of about more than 100 items.',
            Assignee : 'Alok Puri',
            Reviewer : 'Suresh K',
            last_updated_date : '21 Sep 2020',
            progress : __CLOSED__,
        },
        {
            id : '1238',
            tracker : __TRACKER_FEATURE__,
            priority : __URGENT_PRIORITY__,
            subject : 'Add new issues tab to the issues window so that it is more accessible to the new class of users.',
            Assignee : 'Alok Puri',
            Reviewer : 'Suresh K',
            last_updated_date : '21 Oct 2020',
            progress : __CODE_IN_REVIEW__,
        },
    ]
    return(
        <GeneralList heading="Issues">
            {issues.map((issue)=>{
                return <IssueListItem {...issue}/>
            })}
        </GeneralList>
    )
}

export default IssuesListWrapper;