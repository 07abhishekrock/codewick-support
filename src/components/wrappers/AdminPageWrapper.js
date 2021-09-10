import { faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormik } from 'formik';
import * as yup from 'yup';
import React, { useState , useRef, useContext } from 'react'
import { LoadingContext } from '../../utils/contexts';
import { useLoggedOutAlert } from '../../utils/hooks';
import SearchBoxWithList from '../SearchBoxWithList';
import { createAndDispatchClearEvent } from '../SearchBoxWithList';
import DeleteModal from '../DeleteModal';

function UpdateProject(){
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const logged_out_dialog = useLoggedOutAlert();
    const [current_project , set_current_project] = useState({});
    const project_form = useFormik({
        initialValues : {
            title : "",
            members : [],
            description : "",
            project : null
        },
        validationSchema : yup.object({
            title : yup.string().required(),
            project : yup.string().required('Select A Project First').nullable()
        }),
        onSubmit : async ({title , description , members})=>{
            try{
                const project_body = {
                    title,
                    user : members.map(member => member._id), 
                    manager : members.filter(member => member.status === 'manager').map(manager => manager._id),
                    description,
                }
                dispatch_load_obj(['load' , 'Updating Project']);
                const response = await fetch('https://api-redmine.herokuapp.com/api/v1/project/' + current_project._id ,{
                    method  : 'PATCH',
                    body : JSON.stringify(project_body),
                    headers : {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type' : "application/json"
                    }
                })
                if(response.ok){
                    project_form.resetForm();
                    set_current_project({});
                    createAndDispatchClearEvent("projects-list");
                    createAndDispatchClearEvent("members-list");
                    dispatch_load_obj(['info','Project Updated Succesfully']);
                }
                else{
                    await logged_out_dialog(response);
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
            project_form.submitForm();
        }}>
            <h3>Update Existing Project</h3>
            <div className="input-group single-column">
                <label htmlFor="all-projects">Select Project</label>
                <SearchBoxWithList 
                identifier = "projects-list"
                added_list_heading = "Selected Project"
                nameAttribute = "title"
                searchURLGenerator = {keyword=>`https://api-redmine.herokuapp.com/api/v1/project?title[$regex]=^${keyword}&title[$options]=i&limit=6`}
                getDataFromResponse = {data => data.data.data}
                selectItem = {(project)=>{
                    set_current_project(project);
                    const formatted_project = {
                        ...project,
                        project : project._id,
                        members : project.user.map((user)=>{
                            if(project.manager.filter((manager)=>manager._id === user._id).length > 0){
                                return {...user , status : 'manager'}
                            }
                            return {...user , status : 'user'}
                        }),
                    }
                    project_form.setValues(formatted_project);
                }}
                isSelected = {(project)=>project._id === current_project._id}
                selectedItems = {current_project._id ? [current_project] : []}
                operationsOnItems = {[
                    {
                        label : 'Drop Selection',
                        onClick : ()=>{
                            set_current_project({});
                            project_form.resetForm();
                        },
                        isEnabled : ()=>true
                    }
                ]}
                /> 
            </div>
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
                <SearchBoxWithList
                identifier = "members-list"
                added_list_heading = "Added Members"
                nameAttribute = "name"
                searchURLGenerator = {keyword => `https://api-redmine.herokuapp.com/api/v1/user?name[$regex]=^${keyword}&name[$options]=i&limit=6`}
                getDataFromResponse = {data => data.data.data}
                selectItem = {(user)=>{
                    const isFound = project_form.values.members.filter(member=>member._id === user._id)
                    if(isFound.length === 0){
                        project_form.setFieldValue('members',
                            [...project_form.values.members , {...user , status:"user"}]
                        )
                    }
                }}
                isSelected = {(user)=>project_form.values.members.filter(member => member._id === user._id).length > 0}
                selectedItems = {project_form.values.members}
                operationsOnItems = {[
                    {
                        label : 'Add As User',
                        onClick : (user)=>{
                            const new_users = project_form.values.members.map((member)=>{
                                if(member._id === user._id){
                                    return { ...member , status : 'user'};
                                }
                                return member;
                            })
                            project_form.setFieldValue('members',new_users);
                        },
                        isEnabled : (user)=>{
                            const members = project_form.values.members;
                            return members.filter((member)=>member._id === user._id)[0]?.status === 'manager' 
                        }
                    },
                    {
                        label : 'Add As Manager',
                        onClick : (user)=>{
                            const new_users = project_form.values.members.map((member)=>{
                                if(member._id === user._id){
                                    return { ...member , status : 'manager'};
                                }
                                return member;
                            })
                            project_form.setFieldValue('members',new_users);
                        },
                        isEnabled : (user)=>{
                            const members = project_form.values.members;
                            return members.filter((member)=>member._id === user._id)[0]?.status === 'user' 
                        }
                    },
                    {
                        label : 'Delete Member',
                        onClick : (user)=>{
                            console.log('deleting member');
                            const new_users = project_form.values.members.filter(member => member._id !== user._id);
                            project_form.setFieldValue('members',new_users);
                        },
                        isEnabled : ()=>true
                    }
                ]}
                />
            </div>
            <div className="error-div">
                {project_form.errors.title ? <i className="error">{project_form.errors.title}</i> : null}
                {project_form.errors.project ? <i className="error">{project_form.errors.project}</i> : null}
            </div>
            {current_project && current_project._id ? <DeleteModal 
            BtnLabel="Delete This Project" 
            YesLabel="Yes, Delete" 
            NoLabel="No, Cancel"
            onDelete={async ()=>{
                try{
                    dispatch_load_obj(['load' , 'Deleting Project']);
                    const response = await fetch('https://api-redmine.herokuapp.com/api/v1/project/' + current_project._id ,{
                        method  : 'DELETE',
                        headers : {
                            'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                            'Content-Type' : "application/json"
                        }
                    })
                    if(response.ok){
                        project_form.resetForm();
                        set_current_project({});
                        createAndDispatchClearEvent("projects-list");
                        createAndDispatchClearEvent("members-list");
                        dispatch_load_obj(['info','Project Deleted Succesfully']);
                    }
                    else{
                        await logged_out_dialog(response);
                    }
                }
                catch(e){
                    dispatch_load_obj(['info','Some Error Occurred']);
                }
            }}
            />:null}
            <div className="btn-group">
                <button>Update Project</button>
            </div>
        </form>
    )
}

function CreateNewProject(){
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const logged_out_dialog = useLoggedOutAlert();
    const project_form = useFormik({
        initialValues : {
            title : "",
            members : [],
            description : "",
        },
        validationSchema : yup.object({
            title : yup.string().required(),
        }),
        onSubmit : async ({title , description , members})=>{
            try{
                const project_body = {
                    title,
                    user : members.map(member => member._id), 
                    manager : members.filter(member => member.status === 'manager').map(manager => manager._id),
                    description,
                    totalFeature : 0,
                    totalBug : 0
                }
                dispatch_load_obj(['load' , 'Creating Project']);
                const response = await fetch('https://api-redmine.herokuapp.com/api/v1/project',{
                    method  : 'POST',
                    body : JSON.stringify(project_body),
                    headers : {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type' : "application/json"
                    }
                })
                if(response.ok){
                    project_form.resetForm();
                    createAndDispatchClearEvent("members-list");
                    dispatch_load_obj(['info','Project Created Succesfully']);
                }
                else{
                    await logged_out_dialog(response);
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
                <SearchBoxWithList
                identifier = "members-new-list"
                added_list_heading = "Added Members"
                nameAttribute = "name"
                searchURLGenerator = {keyword => `https://api-redmine.herokuapp.com/api/v1/user?name[$regex]=^${keyword}&name[$options]=i&limit=6`}
                getDataFromResponse = {data => data.data.data}
                selectItem = {(user)=>{
                    const isFound = project_form.values.members.filter(member=>member._id === user._id)
                    if(isFound.length === 0){
                        project_form.setFieldValue('members',
                            [...project_form.values.members , {...user , status:"user"}]
                        )
                    }
                }}
                isSelected = {(user)=>project_form.values.members.filter(member => member._id === user._id).length > 0}
                selectedItems = {project_form.values.members}
                operationsOnItems = {[
                    {
                        label : 'Add As User',
                        onClick : (user)=>{
                            const new_users = project_form.values.members.map((member)=>{
                                if(member._id === user._id){
                                    return { ...member , status : 'user'};
                                }
                                return member;
                            })
                            project_form.setFieldValue('members',new_users);
                        },
                        isEnabled : (user)=>{
                            const members = project_form.values.members;
                            return members.filter((member)=>member._id === user._id)[0]?.status === 'manager' 
                        }
                    },
                    {
                        label : 'Add As Manager',
                        onClick : (user)=>{
                            const new_users = project_form.values.members.map((member)=>{
                                if(member._id === user._id){
                                    return { ...member , status : 'manager'};
                                }
                                return member;
                            })
                            project_form.setFieldValue('members',new_users);
                        },
                        isEnabled : (user)=>{
                            const members = project_form.values.members;
                            return members.filter((member)=>member._id === user._id)[0]?.status === 'user' 
                        }
                    },
                    {
                        label : 'Delete Member',
                        onClick : (user)=>{
                            console.log('deleting member');
                            const new_users = project_form.values.members.filter(member => member._id !== user._id);
                            project_form.setFieldValue('members',new_users);
                        },
                        isEnabled : ()=>true
                    }
                ]}
                />
            </div>
            <div className="error-div">
                {project_form.errors.title ? <i className="error">{project_form.errors.title}</i> : null}
            </div>
            <div className="btn-group">
                <button>Add Project</button>
            </div>
        </form>
    )
}

function SendMail(){
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const logged_out_dialog = useLoggedOutAlert();
    const send_mail_form = useFormik({
        initialValues : {
            to : "",
            email : "",
            subject : "",
            template : "None"
        },
        validationSchema : yup.object({
            to : yup.string().required(),
            email : yup.string().required().email(),
            subject : yup.string().required(),
            template : yup.string().required().oneOf(['password-reset','account-block'])
        }),
        onSubmit : async ({to , email , subject , template})=>{
            try{
                // const project_body = {
                //     title,
                //     user : members.map(member => member._id), 
                //     manager : members.filter(member => member.status === 'manager').map(manager => manager._id),
                //     description,
                //     totalFeature : 0,
                //     totalBug : 0
                // }
                // dispatch_load_obj(['load' , '']);
                // const response = await fetch('https://api-redmine.herokuapp.com/api/v1/project',{
                //     method  : 'POST',
                //     body : JSON.stringify(project_body),
                //     headers : {
                //         'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                //         'Content-Type' : "application/json"
                //     }
                // })
                // if(response.ok){
                //     project_form.resetForm();
                //     dispatch_load_obj(['info','Project Created Succesfully']);
                // }
                // else{
                //     await logged_out_dialog(response);
                // }
            }
            catch(e){
                // dispatch_load_obj(['info','Some Error Occurred']);
            }
        }
    });
    return (
        <form className="modal-form" onSubmit={(e)=>{
            e.preventDefault();
            send_mail_form.submitForm();
        }}>
            <h3>Send New Mail</h3>
            <div className="input-group single-column">
                <label htmlFor="mail-to">To</label>
                <input id="mail-to" type="text" {...send_mail_form.getFieldProps('to')}/>
            </div>
            <div className="input-group single-column">
                <label htmlFor="mail-email">Project Description</label>
                <input id="mail-email" {...send_mail_form.getFieldProps('description')} type="text"/>
            </div>
            <div className="input-group single-column">
                <label htmlFor="mail-subject">Subject</label>
                <textarea id="mail-subject" {...send_mail_form.getFieldProps('subject')}></textarea>
            </div>
            <div className="input-group single-column">
                <label htmlFor="mail-subject">Template</label>
                <select id="mail-template" {...send_mail_form.getFieldProps('template')}>
                    <option value="None">Select Template</option>
                    <option value="password-reset">Password Reset</option>
                    <option value="account-reset">Account Reset</option>
                    <option value="new-account">New Account</option>
                </select>
            </div>
            <div className="error-div">
                {send_mail_form.errors.to ? <i className="error">{send_mail_form.errors.to}</i> : null}
                {send_mail_form.errors.email ? <i className="error">{send_mail_form.errors.email}</i> : null}
                {send_mail_form.errors.subject ? <i className="error">{send_mail_form.errors.subject}</i> : null}
                {send_mail_form.errors.template ? <i className="error">{send_mail_form.errors.template}</i> : null}
            </div>
            <div className="btn-group">
                <button>Send Mail</button>
            </div>
        </form>
    )
}

function SendInvoice(){
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const logged_out_dialog = useLoggedOutAlert();
    const [current_user , set_current_user] = useState({});
    const send_invoice_form = useFormik({
        initialValues : {
            invoice_no : "",
            title : "",
            description : "",
            amount : "",
            paymentLink : "",
            username : ""
        },
        validationSchema : yup.object({
            invoice_no : yup.number().required(),
            title : yup.string().required(),
            description : yup.string().required(),
            amount : yup.number().required(),
            paymentLink : yup.string().required().url(),
            username : yup.string().required()
        }),
        onSubmit : async ({invoice_no , title , description , amount , paymentLink})=>{
            try{
                // const project_body = {
                //     title,
                //     user : members.map(member => member._id), 
                //     manager : members.filter(member => member.status === 'manager').map(manager => manager._id),
                //     description,
                //     totalFeature : 0,
                //     totalBug : 0
                // }
                // dispatch_load_obj(['load' , '']);
                // const response = await fetch('https://api-redmine.herokuapp.com/api/v1/project',{
                //     method  : 'POST',
                //     body : JSON.stringify(project_body),
                //     headers : {
                //         'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                //         'Content-Type' : "application/json"
                //     }
                // })
                // if(response.ok){
                //     project_form.resetForm();
                //     dispatch_load_obj(['info','Project Created Succesfully']);
                // }
                // else{
                //     await logged_out_dialog(response);
                // }
            }
            catch(e){
                // dispatch_load_obj(['info','Some Error Occurred']);
            }
        }
    });
    return (
        <form className="modal-form" onSubmit={(e)=>{
            e.preventDefault();
            send_invoice_form.submitForm();
        }}>
            <h3>Send Invoice</h3>
            <div className="input-group single-column">
                <label htmlFor="invoice-no">Invoice Number</label>
                <input id="invoice-no" type="text" {...send_invoice_form.getFieldProps('invoice-no')}/>
            </div>
            <div className="input-group single-column">
                <label htmlFor="invoice-title">Title</label>
                <input id="invoice-title" {...send_invoice_form.getFieldProps('invoice-title')} type="text"/>
            </div>
            <div className="input-group single-column">
                <label htmlFor="invoice-description">Description</label>
                <textarea id="invoice-description" {...send_invoice_form.getFieldProps('description')}></textarea>
            </div>
            <div className="input-group single-column">
                <label htmlFor="invoice-amount">Amount</label>
                <input type="text" id="invoice-amount" {...send_invoice_form.getFieldProps('amount')}/>
            </div>
            <div className="input-group single-column">
                <label htmlFor="select-customer">Select Customer</label>
                <SearchBoxWithList 
                    identifier = "customer-selected"
                    added_list_heading = "Selected Customer"
                    nameAttribute = "name"
                    searchURLGenerator = {keyword=>{
                        return `https://api-redmine.herokuapp.com/api/v1/user?name[$regex]=^${keyword}&name[$options]=i&limit=6&role=customer`
                    }}
                    getDataFromResponse = {data => data.data.data}
                    selectItem = {(user)=>{
                        set_current_user(user);
                        send_invoice_form.setFieldValue('username' , user.name);
                    }}
                    isSelected = {(user)=>current_user._id === user._id}
                    selectedItems = {current_user._id ? [current_user] : []}
                    operationsOnItems = {[
                        {
                            label : 'Drop Selection',
                            onClick : ()=>{
                                set_current_user({});
                            },
                            isEnabled : ()=>true
                        }
                    ]}
                />  
            </div>
            <div className="error-div">
                {send_invoice_form.errors.title ? <i className="error">{send_invoice_form.errors.title}</i> : null}
                {send_invoice_form.errors.description ? <i className="error">{send_invoice_form.errors.description}</i> : null}
                {send_invoice_form.errors.amount ? <i className="error">{send_invoice_form.errors.amount}</i> : null}
                {send_invoice_form.errors.invoice_no ? <i className="error">{send_invoice_form.errors.invoice_no}</i> : null}
                {send_invoice_form.errors.username ? <i className="error">{send_invoice_form.errors.username}</i> : null}
            </div>
            <div className="btn-group">
                <button>Send Invoice</button>
            </div>
        </form>
    )   
}

function CreateNewUser(){
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const logged_out_dialog = useLoggedOutAlert();
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
                    await logged_out_dialog(response);
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
        'Create a New User',
        'Send Mail',
        'Update Project',
        'Send Invoice'
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
                {current_selected_form === 2 ? <SendMail/> : null}
                {current_selected_form === 3 ? <UpdateProject/> : null}
                {current_selected_form === 4 ? <SendInvoice/> : null}
            </div>
        </div>
    )
}

export default AdminPageWrapper
