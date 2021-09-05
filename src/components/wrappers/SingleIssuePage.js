import { useFormik } from "formik"
// import * as yup from 'yup';
import ReactQuill from "react-quill";
import React, { useContext, useState } from "react"
import { GeneralBoxWrapper } from "../GeneralList"
import SingleNoteItem from "../SingleNoteItem"
import { useParams } from "react-router"
import { useFetch } from "../../utils/hooks"
import { LoadingContext, UserContext } from "../../utils/contexts"
import EditorWithUpdate from "../EditorWithUpdate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkSquareAlt, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import CreateTimeLogForm from "../CreateTimeLogForm";
import { Link } from "react-router-dom";
import { logged_out_dialog } from "../../utils/functions";

const getDateStringForInputBox = (date)=>{
    try{
        const date_obj = new Date(date);
        return date_obj.toISOString().substr(0, 10);
    }
    catch(e){
        return '';
    }
}

const EditIssueSection = ({issue_data, set_issue_data})=>{

    const [user_object] = useContext(UserContext);
    const form_data = useFormik({
        initialValues : {
            _id : '123',
            project : {title : 'Codewick-Common' , user : []},
            tracker : 'Feature',
            title : 'Employee should be able to view his payment history',
            description : 'this is a null description',
            status : 'new',
            priority : 'normal',
            assignee  : {name : '' , _id : '' , role : 'admin'},
            reviewer : {name : '' , _id : '', role : 'admin'},
            target : 'sprint',
            startDate : '',
            endDate : '',
            percentageDone : 0,
        },
        onSubmit : async (values)=>{
            try{
                dispatch_load_obj(['load' , 'Updating Issue']);
                const response = await fetch('https://api-redmine.herokuapp.com/api/v1/issue/' + issue_id , {
                    method : 'PATCH',
                    body : JSON.stringify({...values , assignee : values.assignee === 'None' ? null : values.assignee , 
                    reviewer : values.reviewer === 'None' ? null : values.reviewer}),
                    headers : {
                        "Content-Type" : 'application/json',
                        "Authorization" : "Bearer " + localStorage.getItem('token')
                    }
                })
                if(response.ok){
                    dispatch_load_obj(['info', 'Issue Updated Succesfully']);
                }
                else{
                    await logged_out_dialog(dispatch_load_obj , response);
                }
            }
            catch(e){
                dispatch_load_obj(['info','Some Error Occurred']);
            }
        }
    });
    const [,dispatch_load_obj] = useContext(LoadingContext);

    const {issue_id} = useParams();
    useFetch('https://api-redmine.herokuapp.com/api/v1/issue/' + issue_id , 'GET' , true , {} ,
    ()=>{
        dispatch_load_obj(['load' , 'Getting Your Issue']);
    }, 
    (data)=>{
        dispatch_load_obj(['idle']);
        const new_issue_data = {...form_data.initialValues , ...data.data.data};
        set_issue_data(new_issue_data);
        form_data.setValues({...new_issue_data , 
            assignee : (new_issue_data.assignee && new_issue_data.assignee._id) || 'None' 
            , reviewer : (new_issue_data.reviewer && new_issue_data.reviewer._id) || 'None' 
        });
    }, 
    (error)=>{
        dispatch_load_obj(['error',{
            error,
            onRetry : ()=>{
                console.log('retried')
            }
        }]);
    })
    return (
        <>
            <h3 className="box-heading">Edit Issue</h3>
            <form className="edit-issue-form" onSubmit={(e)=>{
                e.preventDefault();
                form_data.submitForm();
            }}>
                {/* <div className="input-group">
                    <label>Project</label>
                    <input type="text" {...form_data.getFieldProps}/>
                </div> */}
                <div className="input-group">
                    <label>Tracker</label>
                    <select {...form_data.getFieldProps('tracker')}>
                        <option value="feature">Feature</option>
                        <option value="bug">Bug</option>
                    </select>
                </div>
                <div className="input-group single-column">
                    <label>Subject</label>
                    <textarea {...form_data.getFieldProps('title')}></textarea>
                </div>
                <div className="input-group single-column">
                    <label>Description</label>
                    <ReactQuill value={form_data.values.description} onChange={(new_value)=>{
                        form_data.setFieldValue('description' , new_value);
                    }}/>
                </div>
                <div className="input-group">
                    <label>Status</label>
                    {issue_data && issue_data.status === 'closed' && user_object.role === 'admin' ?
                    <select {...form_data.getFieldProps('status')}>
                        <option value="new">New</option>
                        <option value="inProgress">In Progress</option>
                        <option value="codeReview">Code Review</option>
                        <option value="resolved">Resolved</option>
                        {user_object.role === 'admin' ? <option value="closed">Closed</option> : null}
                    </select>
                    :null}
                    {issue_data && issue_data.status === 'closed' && user_object.role !== 'admin' ? 
                    <span>Closed</span> : null
                    }
                    {issue_data && issue_data.status !== 'closed' ? 
                     <select {...form_data.getFieldProps('status')}>
                        <option value="new">New</option>
                        <option value="inProgress">In Progress</option>
                        <option value="codeReview">Code Review</option>
                        <option value="resolved">Resolved</option>
                        {user_object.role === 'admin' ? <option value="closed">Closed</option> : null}
                    </select>               
                    :null}
                </div>
                <div className="input-group">
                    <label>Priority</label>
                    <select {...form_data.getFieldProps('priority')}>
                        <option value="normal">Normal</option>
                        <option value="high">Urgent</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Assignee</label>
                    <select {...form_data.getFieldProps('assignee')} value={form_data.values.assignee || 'None'}>
                        <option value="None">Select An Option</option>
                        {issue_data.project && issue_data.project.user.map((user)=>{
                            if(user.role !== 'customer') return <option value={user._id} key={user._id}>{user.name}</option>
                        })}
                    </select>
                </div>
                <div className="input-group">
                    <label>Reviewer</label>
                    <select {...form_data.getFieldProps('reviewer')} value={form_data.values.reviewer || 'None'}>
                        <option value="None">Select An Option</option>
                        {issue_data.project && issue_data.project.user.map((user)=>{
                            if(user.role !== 'customer') return <option value={user._id} key={user._id}>{user.name}</option>
                        })}
                    </select>
                </div>
                <div className="input-group">
                    <label>Target Version</label>
                    <select {...form_data.getFieldProps('target')}>
                        <option value="sprint">Sprint</option>
                        <option value="backlog">Backlog</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Start Date</label>
                    <input type="date" {...form_data.getFieldProps('startDate')} value={getDateStringForInputBox(form_data.values.startDate)}/>
                </div>
                <div className="input-group">
                    <label>Due Date</label>
                    <input type="date" {...form_data.getFieldProps('endDate')} value={getDateStringForInputBox(form_data.values.endDate)}/>
                </div>
                <div className="input-group">
                    <label>% Done</label>
                    <input type="number" min="0" max="100" {...form_data.getFieldProps('percentageDone')}/>
                </div>
                {user_object.role !== 'customer' ? <Link className={"special-link"} to={`./${issue_id}/time_entries`}>Time Logs Data <FontAwesomeIcon icon={faExternalLinkSquareAlt}/></Link> : null}
                <code style={{width:'100%'}}>
                    {/* {JSON.stringify(form_data.values)} */}
                </code>
                <hr/>
                <button>Update Form</button>
            </form>
        </>
    )
}

// const FancyPeekElement = ({option , value , color , status_type , priority_type , tracker_type})=>{
//     return (
//         <div className="fancy-peek-element" style={{color}}>
//             <span>{option}</span>
//             <div
//                 {
//                     ...{
//                         status_type , priority_type , tracker_type
//                     }
//                 } 

//             >{value}</div>
//         </div>
//     )
// }

// const ProgressBar = ({value})=>{
//     return <span className="inline-progress-bar">
//         <i style={{width:`${value}%`}}></i>
//     </span>
// }

const UpdatesWrapper = ({notes , set_notes , issue_id , all_selections})=>{
    const [,dispatch_load_object] = useContext(LoadingContext);

    const upsertList = async (new_note)=>{
        try{
            let isFound = notes.filter(note => note._id === new_note._id);
            let response;
            if(isFound.length === 0){
                //call update api
                dispatch_load_object(['load','Inserting Note']);
                response = await fetch('https://api-redmine.herokuapp.com/api/v1/notes' , {
                    method : 'POST',
                    headers : {
                        "Content-Type" : "application/json",
                        "Authorization" : "Bearer " + localStorage.getItem('token')
                    },
                    body : JSON.stringify({...new_note, issue : issue_id})
                })
                if(response.ok){
                    const note_data = await response.json();
                    dispatch_load_object(['info','Inserted Notes Succesfully']);
                    set_notes([...notes , {...new_note , _id : note_data.data.data._id}]);
                    return;
                }
                else{
                    await logged_out_dialog(dispatch_load_object , response);
                }
            }
            else{
                //call insert api
                //update current list
                dispatch_load_object(['load' , 'Updating Note']);
                console.log(new_note);
                response = await fetch('https://api-redmine.herokuapp.com/api/v1/notes/'+new_note._id , {
                    method : 'PATCH',
                    headers : {
                        "Content-Type" : "application/json",
                        "Authorization" : "Bearer " + localStorage.getItem('token')
                    },
                    body : JSON.stringify({ ...new_note})
                })
                if(response.ok){
                    dispatch_load_object(['info','Updated Notes Succesfully']);
                    return;
                }
                else{
                    await logged_out_dialog(dispatch_load_object , response);
                }
            }
        }
        catch(e){
            dispatch_load_object(['info','Some Error Occurred']);
        }
    } 
    const deleteNote = async (note_id)=>{
        try{
            dispatch_load_object(['load','Deleting Note'])
            const response = await fetch('https://api-redmine.herokuapp.com/api/v1/notes/'+note_id , {
                method : 'DELETE',
                headers : {
                    "Authorization" : "Bearer " + localStorage.getItem('token')
                },
            })
            if(response.ok){
                dispatch_load_object(['info','Note Deleted Succesfully']);
                set_notes(notes.filter(note=>note._id !== note_id));
            }
            else{
                await logged_out_dialog(dispatch_load_object , response);
            }
        }
        catch(e){
            dispatch_load_object(['info','Some Error Occurred']);
        }
    }
    const [current_user_obj] = useContext(UserContext);
    const new_note_obj = {
        notes : '',
        updatedAt : new Date(),
        user : current_user_obj
    }
    const [current_selection , set_current_selection] = useState(-1);
    return (
        <>
            <div className="tabs-wrapper">
                {all_selections.map((selection)=>{
                        return <React.Fragment key={selection.index}>
                                <input type="radio" name="notes-tabs" id={selection.label} checked={selection.index === current_selection} value="0" style={{display:'none'}} onChange={()=>{
                                    set_current_selection(selection.index);
                                }}/>
                                <label className="box-heading" htmlFor={selection.label}>{selection.label}</label>
                            </React.Fragment>
                })}
            </div>
            <div className="updates-section">
                {current_selection === 0 ? <div className="notes-list">
                    {notes && notes.map((note)=>{
                        if(current_user_obj.role === 'admin'){
                            return <SingleNoteItem {...note} key={note._id} noBorder={true} isEditable>
                                <EditorWithUpdate btnText={"Update Note"} updateFunction={upsertList} deleteFunction={deleteNote} note_obj={note}/>
                            </SingleNoteItem>
                        }
                        return <SingleNoteItem {...note} key={note._id}/>
                    })}
                    <SingleNoteItem {...new_note_obj} noBorder={true} isEditable>
                        <EditorWithUpdate btnText={"Add Note"} updateFunction={upsertList} note_obj={new_note_obj} issue={issue_id}/>
                    </SingleNoteItem>
                </div> : null}  
            </div>
        </>
    )
}

const SingleIssuePage = ()=>{
    const [issue_data , set_issue_data] = useState({});
    const [notes , set_notes] = useState([]);
    const [create_log , show_create_log] = useState(false);
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const [user_object] = useContext(UserContext);
    console.log('role is' , user_object.role === 'customer');
    useFetch('https://api-redmine.herokuapp.com/api/v1/notes?issue=' + issue_data._id , 'GET' , true , {} , 
    ()=>{
        dispatch_load_obj(['load','Loading Notes'])
    }, 
    (data)=>{
        const notes_data = data.data.data;
        set_notes(notes_data);
        dispatch_load_obj(['idle'])
    },
    ()=>{
        dispatch_load_obj(['error',{
            error : 'Some Error Occurred',
            onRetry : ()=>{}
        }])
    },
    !(issue_data._id) || user_object.role === 'customer' ? null : true);

    let all_selections = {};
    if(user_object.role === 'customer'){
        all_selections = [
            {
                index : 1,
                label : 'Feedback'
            } , 
        ];
    }
    else{
        all_selections = [
            {
                index : 0,
                label : 'Notes'
            } , 
            {
                index : 1,
                label : 'Feedback'
            } , 
        ]
    }

    return (
        <>
            <div className="project-heading">
                <h1>Issue {issue_data.counter}</h1>
                <span>Created By {issue_data.createdBy && issue_data.createdBy.name}</span>
                <button onClick={() => show_create_log(true)}>Add Time Log &nbsp;<FontAwesomeIcon icon={faPlusCircle}/></button>
            </div>
            {create_log ? <CreateTimeLogForm issue_id={issue_data._id} project_id={issue_data.project && issue_data.project._id} show_create_log={show_create_log}/> : false}
            <GeneralBoxWrapper width={'1200px'}>
                {/* <h3 className="box-heading">ISSUE TITLE</h3>
                <h1 className="main-heading">{issue_data.title || 'No Title Provided'}</h1>
                <h3 className="box-heading">ISSUE DESCRIPTION</h3>
                <div className="para-desc" dangerouslySetInnerHTML={{__html : issue_data.description}}></div> */}
                <EditIssueSection {...{issue_data , set_issue_data}}/>
                {/* <h3 className="box-heading">ISSUE DETAILS</h3>
                <div className="peek-grid">
                    <FancyPeekElement option="Tracker" value={issue_data.tracker} tracker_type={issue_data.tracker === 'feature' ? "0" : "1"}/>
                    <FancyPeekElement option="Status" value={issue_data.status} status_type={returnStatusFromCode(issue_data.status)}/>
                    <FancyPeekElement option="Priority" value={issue_data.priority} priority_type={issue_data.priority === 'normal' ? "0" : "1"}/>
                    <FancyPeekElement option="Target Version" value={issue_data.version || 'no version'}/>
                    <FancyPeekElement option="Assigner" value={issue_data.assignee && issue_data.assignee.name}/>
                    <FancyPeekElement option="Reviewer" value={issue_data.reviewer && issue_data.reviewer.name}/>
                    <FancyPeekElement option="Start Date" value="23 Aug 2021"/>
                    <FancyPeekElement option="End Date" value="23 Sep 2021"/>
                    <FancyPeekElement option="% Done" value={<ProgressBar value={issue_data.donePercentage}/>}/>
                    <FancyPeekElement option="Time Spent" value="3 Hrs"/>
                </div> */}
                <UpdatesWrapper all_selections={all_selections} notes={notes} set_notes={set_notes} issue_id={issue_data._id || null}/>
            </GeneralBoxWrapper>
        </>
    )
}

export default SingleIssuePage;