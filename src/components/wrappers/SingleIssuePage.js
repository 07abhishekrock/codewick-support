import { useFormik } from "formik"
import QuillEditor from "../QuillEditor"
import React, { useState } from "react"
import { GeneralBoxWrapper } from "../GeneralList"
import SingleNoteItem, { sampleNoteItem } from "../SingleNoteItem"

const EditIssueSection = ()=>{

    const form_data = useFormik({
        initialValues : {
            project : 'Codewick-Common',
            tracker : 'Feature',
            subject : 'Employee should be able to view his payment history',
            description : 'this is a null description',
            status : 'In Progress',
            priority : 'Normal',
            assignee  : 'Alok Puri',
            reviewer : 'Alain Fernandes',
            targetVersion : '001-Sprint',
            startDate : '2021-08-04',
            dueDate : '2021-09-25',
            donePercentage : 50,
        }
    });

    return (
        <>
            <h3 className="box-heading">Edit Issue</h3>
            <form className="edit-issue-form">
                {/* <div className="input-group">
                    <label>Project</label>
                    <input type="text" {...form_data.getFieldProps}/>
                </div> */}
                <div className="input-group">
                    <label>Tracker</label>
                    <select {...form_data.getFieldProps('tracker')}>
                        <option>Feature</option>
                        <option>Bug</option>
                    </select>
                </div>
                <div className="input-group single-column">
                    <label>Subject</label>
                    <textarea {...form_data.getFieldProps('subject')}></textarea>
                </div>
                <div className="input-group single-column">
                    <label>Description</label>
                    <QuillEditor initialValue={form_data.values.description} onChange={(new_html_value)=>{
                        form_data.setFieldValue('description',new_html_value);
                    }}/>
                </div>
                <div className="input-group">
                    <label>Status</label>
                    <select {...form_data.getFieldProps('status')}>
                        <option>New</option>
                        <option>In Progress</option>
                        <option>Code Review</option>
                        <option>Resolved</option>
                        <option>Closed</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Priority</label>
                    <select {...form_data.getFieldProps('priority')}>
                        <option>Normal</option>
                        <option>Urgent</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Assignee</label>
                    <select {...form_data.getFieldProps('assignee')}>
                        <option>Alok Puri</option>
                        <option>Alain Fernandes</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Reviewer</label>
                    <select {...form_data.getFieldProps('reviewer')}>
                        <option>Alok Puri</option>
                        <option>Alain Fernandes</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Target Version</label>
                    <input type="text" {...form_data.getFieldProps('targetVersion')}/>
                </div>
                <div className="input-group">
                    <label>Start Date</label>
                    <input type="date" {...form_data.getFieldProps('startDate')}/>
                </div>
                <div className="input-group">
                    <label>Due Date</label>
                    <input type="date" {...form_data.getFieldProps('dueDate')}/>
                </div>
                <div className="input-group">
                    <label>% Done</label>
                    <input type="number" {...form_data.getFieldProps('donePercentage')}/>
                </div>
                <code style={{width:'100%'}}>
                    {/* {JSON.stringify(form_data.values)} */}
                </code>
            </form>
        </>
    )
}

const FancyPeekElement = ({option , value , color , status_type , priority_type , tracker_type})=>{
    return (
        <div className="fancy-peek-element" style={{color}}>
            <span>{option}</span>
            <div
                {
                    ...{
                        status_type , priority_type , tracker_type
                    }
                } 

            >{value}</div>
        </div>
    )
}

const ProgressBar = ({value})=>{
    return <span className="inline-progress-bar">
        <i style={{width:`${value}%`}}></i>
    </span>
}

const UpdatesWrapper = ()=>{
    const all_selections = [
        {
            index : 0,
            label : 'Notes'
        } , 
        {
            index : 1,
            label : 'History'
        } , 
        {
            index : 2,
            label : 'Property Changes'
        } , 
    ];
    const [current_selection , set_current_selection] = useState(0);
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
                    <SingleNoteItem {...sampleNoteItem}/>
                    <SingleNoteItem {...sampleNoteItem}/>
                    <SingleNoteItem {...sampleNoteItem}/>
                </div> : null}  
            </div>
        </>
    )
}

const SingleIssuePage = ()=>{
    return (
        <>
            <div className="project-heading">
                <h1>Issue #1234</h1>
                <span>Details for issue id 1234</span>
            </div>
            <GeneralBoxWrapper width={'1200px'}>
                <h3 className="box-heading">ISSUE TITLE</h3>
                <h1 className="main-heading">Employee should be able to view his payment history.</h1>
                <h3 className="box-heading">ISSUE DESCRIPTION</h3>
                <p className="para-desc">No Description Provided</p>
                <h3 className="box-heading">ISSUE DETAILS</h3>
                <div className="peek-grid">
                    <FancyPeekElement option="Tracker" value="Feature" tracker_type="0"/>
                    <FancyPeekElement option="Status" value="In Progress" status_type="1"/>
                    <FancyPeekElement option="Priority" value="Normal" priority_type="0"/>
                    <FancyPeekElement option="Target Version" value="001 Sprint"/>
                    <FancyPeekElement option="Assigner" value="Alok Puri"/>
                    <FancyPeekElement option="Reviewer" value="Alain Fernandes"/>
                    <FancyPeekElement option="Start Date" value="23 Aug 2021"/>
                    <FancyPeekElement option="End Date" value="23 Sep 2021"/>
                    <FancyPeekElement option="% Done" value={<ProgressBar value={50}/>}/>
                    <FancyPeekElement option="Time Spent" value="3 Hrs"/>
                </div>
                <UpdatesWrapper/>
                <EditIssueSection/>
            </GeneralBoxWrapper>
        </>
    )
}

export default SingleIssuePage;