import React , {useContext , useEffect, useState} from 'react'
import {useParams} from 'react-router';
import { Redirect } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { LoadingContext, UserContext } from '../utils/contexts';
import { useFetch } from '../utils/hooks';
import SearchBoxWithList from './SearchBoxWithList';

function UpdateAllUsersWrapper(){
    const [user_to_be_updated , set_user_to_be_updated] = useState({});
    return (
        <div className="update-all-users-wrapper input-group single-column">
            <label>Select A User</label>
            <SearchBoxWithList
            searchURLGenerator = {(keyword)=>`https://api-redmine.herokuapp.com/api/v1/user?name[$regex]=^${keyword}&name[$options]=i`}
            selectItem = {(user)=>{
                set_user_to_be_updated(user)
            }} 
            isSelected = {(user)=>user._id === user_to_be_updated._id} 
            operationsOnItems = {[
                {
                    label : 'Drop User',
                    onClick : ()=>set_user_to_be_updated({}),
                    isEnabled : ()=>true
                }
            ]}
            added_list_heading = "User To Be Updated"
            getDataFromResponse = {(data) => data.data.data}
            selectedItems = {user_to_be_updated._id ? [user_to_be_updated] : []}
            nameAttribute = "name"
            identifier = "updating-users-list"
            />
            {user_to_be_updated && user_to_be_updated._id ? <>
                <UserDetailsForm user_to_be_updated={user_to_be_updated}/>
                <UpdatePasswordForm user_to_be_updated={user_to_be_updated}/>
            </> : null}
        </div>
    )
}

function UpdatePasswordForm({user_to_be_updated , disabled}) {
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const update_password_form = useFormik({
        initialValues : {
            currentpass : "",
            newpass : "",
            confpass : "",
        },
        validationSchema : yup.object({
            currentpass : yup.string().min(8).required(),
            newpass : yup.string().min(8).required(),
            confpass : yup.string().min(8).required()
        }),
        onSubmit : (values)=>{
            console.log(values);
        }
    })

    return (
        <form className="user-profile-page" onSubmit = {e => {
            e.preventDefault();
            update_password_form.submitForm();
        }}>
            <div className="user-profile-input-group">
                <label>Current Password</label>
                <input type="password" {...update_password_form.getFieldProps('currentpass')}/>
            </div>
            <div className="user-profile-input-group">
                <label>New Password</label>
                <input type="password" {...update_password_form.getFieldProps('newpass')}/>
            </div>
            <div className="user-profile-input-group">
                <label>Confirm Password</label>
                <input type="password" {...update_password_form.getFieldProps('confpass')}/>
            </div>
            <button>Update Password</button>
        </form>
    )

}

function UserDetailsForm ({user_to_be_updated , disabled}){
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const user_form = useFormik({
        initialValues : {
            name : user_to_be_updated.name,
            email : user_to_be_updated.email,
            phone : user_to_be_updated.phone
        },
        validationSchema : yup.object({
            name : yup.string().required(),
            email : yup.string().email().required(),
            phone : yup.string().required()
        }),
        onSubmit : async (values)=>{
            try{
                dispatch_load_obj(['load' , 'Updating Details']);
                const response = await fetch('https://api-redmine.herokuapp.com/api/v1/user/' + user_to_be_updated._id , {
                    method : 'PATCH',
                    body : JSON.stringify(values),
                    headers : {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }) 
                if(response.ok){
                    const data = await response.json();
                    console.log(data);
                    dispatch_load_obj(['info', 'Details Updated']);
                }
                else{
                    dispatch_load_obj(['info', 'Some Error Occurred']);
                }
            }
            catch(e){
                dispatch_load_obj(['info', 'Some Error Occurred']);
            }
        }
    })
    useEffect(()=>{
        user_form.setValues({
            name : user_to_be_updated.name,
            email : user_to_be_updated.email,
            phone : user_to_be_updated.phone || ""
        })
    },[user_to_be_updated])
    return (
        <form className="user-profile-page" onSubmit = {e => {
            e.preventDefault();
            user_form.submitForm();
        }}>
            <div className="user-profile-image">
                <img alt="user-image" src={user_to_be_updated.avator}/>
                {/* <input type="file"/> */}
            </div>
            <div className="user-profile-input-group">
                <label>Name</label>
                {disabled ? <span>{user_to_be_updated.name || 'N/A'}</span> :  <input type="text" {...user_form.getFieldProps('name')}/>}
            </div>
            <div className="user-profile-input-group">
                <label>Email</label>
                {disabled ? <span>{user_to_be_updated.email || 'N/A'}</span> :  <input type="text" {...user_form.getFieldProps('email')}/>}
            </div>
            <div className="user-profile-input-group">
                <label>Phone Number</label>
                {disabled ? <span>{user_to_be_updated.phone || 'N/A'}</span> :  <input type="text" {...user_form.getFieldProps('phone')}/>}
            </div>
            {disabled ? null : <button>Update</button>}
        </form>
    )
}

function UserProfilePage({all_users , self_profile}) {
    const {user_id} = useParams();
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const [user_object] = useContext(UserContext);
    const [current_user , set_current_user] = useState({});
    useFetch('https://api-redmine.herokuapp.com/api/v1/user/' + user_id , 'GET', true , {} ,
    ()=>{
        dispatch_load_obj(['load','Loading User']);
    },
    (data)=>{
        dispatch_load_obj(['idle']);
        const user_data = data.data.data;
        set_current_user(user_data);
    },
    (error)=>{
        dispatch_load_obj(['error',{
            error,
            onRetry : null
        }])
    },
    !user_id || user_object._id === user_id || all_users ? null : true
    )
    if(self_profile){
        return <>
            <h1 className="soft-heading">Your Details</h1>
            <UserDetailsForm user_to_be_updated={user_object}/>
            <UpdatePasswordForm user_to_be_updated={user_object}/>
        </>
    }
    else if(user_id && user_id === user_object._id){
        return <>
            <Redirect to="/profile"></Redirect>
        </>
    }
    else if(all_users){
        return <>
            <h1 className="soft-heading">Update All Users</h1>
            <UpdateAllUsersWrapper/> 
        </>
    }
    else if(user_id && user_id !== user_object._id && user_object.role === 'admin' && current_user._id){
        return <>
            <h1 className="soft-heading">Update User Details</h1>
            <UserDetailsForm user_to_be_updated={current_user}/>
            <UpdatePasswordForm user_to_be_updated={current_user}/>
        </>
    }
    else if(user_id && user_id !== user_object._id && user_object.role !== 'admin' && current_user._id){
        return <>
            <h1 className="soft-heading">User Details</h1>
            <UserDetailsForm user_to_be_updated={current_user} disabled/>
        </>
    }
    else{
        return <>
            <h1 className="soft-heading">Loading User Details ...</h1>
        </>
    }
}

export default UserProfilePage
