import { faPlus, faPlusCircle, faTimesCircle , faSearch, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormik } from 'formik';
import * as yup from 'yup';
import React, { useState , useRef, useContext } from 'react'
import { LoadingContext } from '../../utils/contexts';
import { logged_out_dialog } from '../../utils/functions';
function CreateNewProject(){
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const project_form = useFormik({
        initialValues : {
            title : "",
            members : [],
            description : "",
            users:[],
            managers : []
        },
        validationSchema : yup.object({
            title : yup.string().required(),
            users : yup.array().min(1),
        }),
        onSubmit : async ({title , users , managers , description})=>{
            try{
                const project_body = {
                    title,
                    user : users, 
                    manager : managers,
                    description,
                    totalFeature : 0
                }
                const response = await fetch('https://api-redmine.herokuapp.com/api/v1/project',{
                    method  : 'POST',
                    body : JSON.stringify({...project_body , user : [...users , ...managers]}),
                    headers : {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type' : "application/json"
                    }
                })
                if(response.ok){
                    dispatch_load_obj(['info','Project Added Succesfully']);
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
    const [search_users , set_search_users] = useState([]);
    const [loading , set_loading] = useState(false);
    const typing_timeout = useRef(null);
    return (
        <form className="modal-form" onSubmit={(e)=>{
            e.preventDefault();
            project_form.submitForm();
        }}>
            <h3>Create New Project</h3>
            <div className="input-group single-column">
                <label htmlFor="project-title">Project Title</label>
                <input id="project-title" type="text" {...project_form.getFieldProps('title')}/>
            </div>
            <div className="input-group single-column">
                <label htmlFor="project-desc">Project Description</label>
                <textarea id="project-desc" {...project_form.getFieldProps('description')}></textarea>
            </div>
            <div className="input-group single-column">
                <label htmlFor="add-members">Add Members</label>
                <div className="search-bar-with-list">
                    <div className="inner-search-bar">
                        <FontAwesomeIcon icon={faSearch}/>
                        <input type="text" placeholder="Start Typing Names" onChange={(e)=>{
                            clearTimeout(typing_timeout.current);
                            if(e.target.value.trim()){
                                typing_timeout.current = setTimeout(async ()=>{
                                    try{
                                        set_loading(true);
                                        const response = await fetch("https://api-redmine.herokuapp.com/api/v1/user?name[$options]=i&limit=6&name[$regex]=" + e.target.value.trim() , 
                                        {
                                            method : 'GET',
                                            headers : {
                                                "Authorization" : "Bearer " + localStorage.getItem('token')
                                            }
                                        });
                                        if(response.ok){
                                            const user_data = await response.json();
                                            set_search_users(user_data.data.data);
                                            set_loading(false);
                                        }
                                    } 
                                    catch(e){
                                        console.error(e);
                                    }
                                } , 800)
                            }
                        }}/>
                    </div>
                    <div className="search-list">
                        {
                        loading ? <h1>Loading Users...</h1> : search_users.map((search_user)=>{
                            if(project_form.values.members.filter(member => member._id === search_user._id).length === 0){
                                return (
                                    <div className="search-list-item" key={search_user._id}>
                                    {search_user.name}
                                    <span onClick={()=>{
                                        console.log('added');
                                        project_form.setFieldValue('members',[...project_form.values.members , search_user]);
                                        project_form.setFieldValue('users',[...project_form.values.users , search_user._id])
                                    }}>Add Member</span>
                                </div>
                                )
                            }
                            return (
                                <div className="search-list-item" key={search_user._id}>
                                    {search_user.name}
                                    <span>Added</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <h3>Added Members</h3>
                <div className="selected-items">
                    {project_form.values.members.map((target_single_user)=>{
                        return <span key={target_single_user._id}>
                            {target_single_user.name}
                            &nbsp;
                            {project_form.values.managers.includes(target_single_user._id) ? null : <button onClick={()=>{
                                const user_id = target_single_user._id;
                                project_form.setFieldValue('users',project_form.values.users.filter(user=>user!==user_id));
                                project_form.setFieldValue('managers',[...project_form.values.managers , user_id]);
                            }}>Add As Manager</button>}
                            {project_form.values.users.includes(target_single_user._id) ? null : <button onClick={()=>{
                                const user_id = target_single_user._id;
                                project_form.setFieldValue('managers',project_form.values.managers.filter(manager=>manager!==user_id));
                                project_form.setFieldValue('users',[...project_form.values.users , user_id]);
                            }}
                            >Add As User</button>}
                            <button onClick={()=>{
                                const user_id = target_single_user._id;
                                project_form.setFieldValue('managers',project_form.values.managers.filter(manager=>manager!==user_id));
                                project_form.setFieldValue('users',project_form.values.users.filter(user=>user!==user_id));
                                project_form.setFieldValue('members',project_form.values.members.filter(member=>member._id!==user_id));
                            }}>Delete Member</button>
                        </span>
                    })}
                </div>
            </div>
            <div className="error-div">
                {project_form.errors.title ? <i className="error">{project_form.errors.title}</i> : null}
                {project_form.errors.users ? <i className="error">{project_form.errors.users}</i> : null}
            </div>
            <div className="btn-group">
                <button>Add Project</button>
            </div>
        </form>
    )
}

function CreateNewUser(){
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const user_form = useFormik({
        initialValues : {
            name : '',
            email : '',
            password : '',
            phoneNo : '',
            role : 'admin'
        },
        validationSchema : yup.object({
            name : yup.string().required(),
            email : yup.string().email().required(),
            password : yup.string().min(8).required(),
            phoneNo : yup.string().length(10).required(),
            role : yup.string().oneOf(['admin' , 'customer', 'developer'])
        }),
        onSubmit : async (values)=>{
            try{
                dispatch_load_obj(['load','Adding User']);
                const response = await fetch('https://api-redmine.herokuapp.com/api/v1/user' , {
                    method : 'POST',
                    body : JSON.stringify(values),
                    headers : {
                        "Authorization" : "Bearer " + localStorage.getItem('token'),
                        "Content-Type" : "application/json"
                    }
                })
                if(response.ok){
                    dispatch_load_obj(['info','User Added Succesfully']);
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
    return (
        <form className="modal-form" onSubmit={(e)=>{
            e.preventDefault();
            user_form.submitForm();
        }}>
            <h3>Create New User</h3>
            <div className="input-group single-column">
                <label htmlFor="new-user-name">Name</label>
                <input type="text" id="new-user-name" {...user_form.getFieldProps('name')}/>
            </div>
            <div className="input-group single-column">
                <label htmlFor="new-user-email">Email</label>
                <input type="text" id="new-user-email" {...user_form.getFieldProps('email')}/>
            </div>
            <div className="input-group single-column">
                <label htmlFor="new-user-password">Password</label>
                <input type="text" id="new-user-password" {...user_form.getFieldProps('password')}/>
            </div>
            <div className="input-group single-column">
                <label htmlFor="new-user-phoneNo">Phone No</label>
                <input type="text" id="new-user-phoneNO" {...user_form.getFieldProps('phoneNo')}/>
            </div>
            <div className="input-group no-grid">
                <label htmlFor="new-user-role">Role</label>
                <select {...user_form.getFieldProps('role')}>
                    <option value="admin">Admin</option>
                    <option value="developer">Developer</option>
                    <option value="customer">Customer</option>
                </select>
            </div>
            <div className="error-div">
                {user_form.errors.email ? <i>{user_form.errors.email}</i> : null}
                {user_form.errors.password ? <i>{user_form.errors.password}</i> : null}
                {user_form.errors.phoneNo ? <i>{user_form.errors.phoneNo}</i> : null}
                {user_form.errors.role ? <i>{user_form.errors.role}</i> : null}
                {user_form.errors.name ? <i>{user_form.errors.name}</i> : null}
            </div>
            <div className="btn-group">
                <button>Add User</button>
            </div>
        </form>
    )
}

function AdminPageWrapper() {
    const [current_selected_form , set_current_selected_form] = useState(0);
    const options = [
        'Create a New Project',
        'Create a New User'
    ]
    return (
        <div className="admin-page-wrapper">
            <div className="admin-page-buttons">
                {options.map((option,index)=>{
                    if(index === current_selected_form)
                    {
                        return <span key={index} onClick={set_current_selected_form.bind(null,index)} select={1}>
                            {option}&nbsp;
                            <FontAwesomeIcon icon={faPlusCircle}/>
                        </span>
                    }

                    return <span onClick={set_current_selected_form.bind(null,index)} key={index}>
                            {option}&nbsp;
                            <FontAwesomeIcon icon={faPlusCircle}/>
                    </span>
                })}
            </div>
            <div className="admin-page-modal-wrapper">
                {current_selected_form === 0 ? <CreateNewProject/> : null}
                {current_selected_form === 1 ? <CreateNewUser/> : null}
            </div>
        </div>
    )
}

export default AdminPageWrapper
