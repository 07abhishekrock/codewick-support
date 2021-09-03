import React, { useContext, useState } from 'react'
import { useFormik } from 'formik';
import { LoadingContext } from '../utils/contexts';
import { useFetch } from '../utils/hooks';
import * as yup from 'yup';
import QuillEditor from './QuillEditor';

function CreateNewIssueForm({addNewIssue , projects_array , showCombo , toggleDialog}){
    const [, dispatch_load_object] = useContext(LoadingContext);
    const current_project_id = (projects_array[0] && projects_array[0].id) || null;
    const [all_members , set_all_members] = useState([]);
    const user_object = JSON.parse(localStorage.getItem('user'));
    useFetch('https://api-redmine.herokuapp.com/api/v1/project/' + current_project_id , 'GET' , true , {} , 
        ()=>{
            dispatch_load_object(['load', 'Loading Options']);
        },
        (data)=>{
            dispatch_load_object(['idle']);
            set_all_members(data.data.data.user);
        },
        (error)=>{
            dispatch_load_object(['error',{
                error,
                onRetry : ()=>{console.log('we can retry here')}
            }])
        }
    ,current_project_id)
    const create_issue_form = useFormik({
        initialValues : {
            project : current_project_id,
            title : '',
            description : '',
            tracker : 'feature',
            priority : 'normal',
            assignee : '',
            reviewer : '',
            createdBy : user_object._id,
            status : 'new'
        },
        validationSchema : yup.object({
            project : yup.string().required(),
            title : yup.string().required(),
            description : yup.string().required(),
            tracker : yup.string().oneOf(['feature', 'bug']),
            priority : yup.string().oneOf(['normal' , 'high']),
        }),
        onSubmit : async (values)=>{
            try{
                dispatch_load_object(['load','Adding Issue to Project']);
                const response = await fetch('https://api-redmine.herokuapp.com/api/v1/issue' , {
                    method : 'POST',
                    headers : {
                        "Content-Type" : "application/json",
                        "Authorization" : "Bearer " + localStorage.getItem('token')
                    },
                    body : JSON.stringify(values)
                });
                if(response.ok){
                    const issue_obj = await response.json();
                    addNewIssue(issue_obj.data.issue);
                    dispatch_load_object(['info','Issue Added Succesfully']);
                }
                else{
                    dispatch_load_object(['info','Issue could not be added']);
                }
            }
            catch(e){
                dispatch_load_object(['info','Issue could not be added']);
            }
        }
    });
    return (
        <div className="modal-wrapper">
            <div className="modal-form-wrapper">
                <form className="modal-form" style={{fontSize:'0.9em'}} onSubmit={(e)=>{
                    e.preventDefault();
                    create_issue_form.submitForm();
                }}>
                    <h3>Create New Issue</h3>
                    {showCombo ? <div className="input-group">
                        <label htmlFor={"project-ids"}>Project</label>
                        <select id="project-ids" {...create_issue_form.getFieldProps('project')}>
                            {projects_array.map((project)=>{
                                return <option key={project.id} value={project.id}>{project.title}</option>
                            })}
                        </select>
                    </div> : null} 
                    <div className="input-group single-column">
                        <label htmlFor="issue-title">Issue Title</label>
                        <input type="text" id="issue-title" {...create_issue_form.getFieldProps('title')}/>
                    </div>
                    <div className="input-group single-column">
                        <label htmlFor="issue-desc">Issue Description</label>
                        <QuillEditor initialValue="" onChange={(new_html_value)=>{
                            create_issue_form.setFieldValue('description', new_html_value);
                        }}/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="issue-tracker">Issue Tracker</label>
                        <select id="issue-tracker" {...create_issue_form.getFieldProps('tracker')}>
                            <option value="feature">Feature</option>
                            <option value="bug">Bug</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="issue-priority">Issue Priority</label>
                        <select id="issue-priority"  {...create_issue_form.getFieldProps('priority')}>
                            <option value="normal">Normal</option>
                            <option value="high">Urgent</option>
                        </select>
                    </div>


                    {user_object.role === 'customer' ? null : <>
                        <div className="input-group">
                            <label htmlFor="issue-assignee">Issue Assignee</label>
                            <select id="issue-assignee" {...create_issue_form.getFieldProps('assignee')}>
                                <option value="None">Select An Option</option>
                                {all_members.map((member)=>{
                                    if(member.role !== 'customer') return <option value={member._id} key={member._id}>{member.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="issue-reviewer">Issue Reviewer</label>
                            <select id="issue-reviewer" {...create_issue_form.getFieldProps('reviewer')}>
                                <option value="None">Select An Option</option>
                                {all_members.map((member)=>{
                                    if(member.role !== 'customer') return <option value={member._id} key={member._id}>{member.name}</option>
                                })}
                            </select>
                        </div>
                    </>}
                    <div className="btn-group">
                        <button type="submit">Add New Issue</button>
                        <button style={{background:"red"}} onClick={()=>{
                            create_issue_form.resetForm();
                            toggleDialog(0);
                        }}>Cancel Issue</button>
                    </div>
                </form>
            </div>
    </div>
    )
}

export default CreateNewIssueForm