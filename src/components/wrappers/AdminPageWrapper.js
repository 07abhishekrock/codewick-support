import { faPlus, faPlusCircle, faTimesCircle , faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormik } from 'formik';
import * as yup from 'yup';
import React, { useState } from 'react'

function CreateNewProject(){
    const project_form = useFormik({
        initialValues : {
            title : "",
            user : [],
            totalFeature : 0,
            description : ""
        }
    });
    const [search_users , set_search_users] = useState([]);
    const [loading , set_loading] = useState(0);
    return (
        <form className="modal-form">
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
                        <input type="text" placeholder="Start Typing Names"/>
                    </div>
                    <div className="search-list">
                        {search_users.map((search_user)=>{
                            if(project_form.values.user.includes(search_user.id)){
                                return (
                                    <div className="search-list-item">
                                    {search_user.name}
                                    <span onClick={()=>{
                                        project_form.setFieldValue('user',[...project_form.values.user , search_user.id]);
                                    }}>Add Item</span>
                                </div>
                                )
                            }
                            return (
                                <div className="search-list-item">
                                    {search_user.name}
                                    <span>Added</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <h3>Added Members</h3>
                <div className="selected-items">
                    {project_form.values.user.map((target_single_user)=>{
                        <span>
                            {target_single_user}
                            &nbsp;
                            <i onClick={()=>{
                                project_form.setFieldValue('user',project_form.values.user.filter(single_user => single_user !== target_single_user));
                            }}><FontAwesomeIcon icon={faTimesCircle}/></i>
                        </span>
                    })}
                </div>
            </div>
            <div className="btn-group">
                <button>Add Project</button>
            </div>
        </form>
    )
}

function CreateNewUser(){
    return (
        <form className="modal-form">
            <h3>Create New User</h3>
            <div className="input-group single-column">
                <label htmlFor="new-user-name">Name</label>
                <input type="text" id="new-user-name"/>
            </div>
            <div className="input-group single-column">
                <label htmlFor="new-user-email">Email</label>
                <input type="text" id="new-user-email"/>
            </div>
            <div className="input-group single-column">
                <label htmlFor="new-user-password">Password</label>
                <input type="text" id="new-user-password"/>
            </div>
            <div className="input-group single-column">
                <label htmlFor="new-user-phoneNo">Phone No</label>
                <input type="password" id="new-user-phoneNO"/>
            </div>
            <div className="input-group no-grid">
                <label htmlFor="new-user-role">Role</label>
                <select>
                    <option>Admin</option>
                    <option>Developer</option>
                    <option>Customer</option>
                </select>
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
                        return <span onClick={set_current_selected_form.bind(null,index)} select={1}>
                            {option}&nbsp;
                            <FontAwesomeIcon icon={faPlusCircle}/>
                        </span>
                    }

                    return <span onClick={set_current_selected_form.bind(null,index)}>
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
