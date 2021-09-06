import React, { useContext, useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { LoadingContext , UserContext } from '../utils/contexts';
import { useLoggedOutAlert } from '../utils/hooks';
import { useParams } from 'react-router';
import SearchBoxWithList from './SearchBoxWithList';
import * as yup from 'yup';
import QuillEditor from './QuillEditor';

function CreateNewIssueForm({addNewIssue , showCombo , toggleDialog , current_project_data}){
    const [, dispatch_load_object] = useContext(LoadingContext);
    const [all_members , set_all_members] = useState([]);
    const [current_project , set_current_project] = useState({});
    const [user_object] = useContext(UserContext);
    const { project_name: project_id } = useParams();
    const logged_out_dialog = useLoggedOutAlert();
    const create_issue_form = useFormik({
        initialValues : {
            project : project_id,
            title : '',
            description : '',
            tracker : 'feature',
            priority : 'normal',
            assignee : 'None',
            reviewer : 'None',
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
                if(values.assignee === 'None') values.assignee = null;
                if(values.reviewer === 'None') values.reviewer = null;

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
                    const issue_response = await response.json();
                    const issue_obj = issue_response.data.issue;
                    addNewIssue({...issue_obj , 
                        assignee : all_members.filter((member)=>member._id === issue_obj.assignee)[0],
                        reviewer : all_members.filter((member)=>member._id === issue_obj.reviewer)[0],
                    });
                    dispatch_load_object(['info','Issue Added Succesfully']);
                }
                else{
                    await logged_out_dialog(response);
                }
            }
            catch(e){
                dispatch_load_object(['info','Issue could not be added']);
            }
        }
    });
    useEffect(()=>{
        if(current_project_data && current_project_data._id){
            create_issue_form.values.project = current_project_data._id;
            console.log(current_project_data.user);
            set_all_members(current_project_data.user);
        }
    },[current_project_data])
    return (
        <div className="modal-wrapper">
            <div className="modal-form-wrapper">
                <form className="modal-form" style={{fontSize:'0.9em'}} onSubmit={(e)=>{
                    e.preventDefault();
                    create_issue_form.submitForm();
                }}>
                    <h3>Create New Issue</h3>
                    {showCombo ? <div className="input-group single-column">
                    <label htmlFor={"project-ids"}>Project</label>
                    <SearchBoxWithList 
                    identifier = "projects-create-issue-list"
                    added_list_heading = "Selected Project"
                    nameAttribute = "title"
                    searchURLGenerator = {keyword=>{
                        if(user_object.role === 'admin') return `https://api-redmine.herokuapp.com/api/v1/project?title[$regex]=^${keyword}&title[$options]=i&limit=6`
                        else return `https://api-redmine.herokuapp.com/api/v1/project/my-project?title[$regex]=^${keyword}&title[$options]=i&limit=6`
                    }}
                    getDataFromResponse = {data => data.data.data}
                    selectItem = {(project)=>{
                        set_current_project(project);
                        set_all_members(project.user);
                        create_issue_form.setFieldValue('project',project._id);
                    }}
                    isSelected = {(project)=>project._id === current_project._id}
                    selectedItems = {current_project._id ? [current_project] : []}
                    operationsOnItems = {[
                        {
                            label : 'Drop Selection',
                            onClick : ()=>{
                                set_current_project({});
                            },
                            isEnabled : ()=>true
                        }
                    ]}
                />  
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
                                    if(member.role && member.role !== 'customer') return <option value={member._id} key={member._id}>{member.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="issue-reviewer">Issue Reviewer</label>
                            <select id="issue-reviewer" {...create_issue_form.getFieldProps('reviewer')}>
                                <option value="None">Select An Option</option>
                                {all_members.map((member)=>{
                                    if(member.role && member.role !== 'customer') return <option value={member._id} key={member._id}>{member.name}</option>
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