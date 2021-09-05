import React , {useContext} from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { LoadingContext, UserContext } from '../utils/contexts';

function UserProfilePage() {
    const [user_object] = useContext(UserContext);
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const user_form = useFormik({
        initialValues : {
            name : user_object.name,
            email : user_object.email,
            phone : user_object.phone
        },
        validationSchema : yup.object({
            name : yup.string().required(),
            email : yup.string().email().required(),
            phone : yup.string().required()
        }),
        onSubmit : async (values)=>{
            try{
                dispatch_load_obj(['load' , 'Updating Details']);
                const response = await fetch('https://api-redmine.herokuapp.com/api/v1/user/' + user_object._id , {
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
    return (
        <form className="user-profile-page" onSubmit = {e => {
            e.preventDefault();
            user_form.submitForm();
        }}>
            <div className="user-profile-image">
                <img alt="user-image" src={user_object.avator}/>
                {/* <input type="file"/> */}
            </div>
            <div className="user-profile-input-group">
                <label>Name</label>
                <input type="text" {...user_form.getFieldProps('name')}/>
            </div>
            <div className="user-profile-input-group">
                <label>Email</label>
                <input type="text" {...user_form.getFieldProps('email')}/>
            </div>
            <div className="user-profile-input-group">
                <label>Phone Number</label>
                <input type="text" {...user_form.getFieldProps('phone')}/>
            </div>
            <button>Update</button>
        </form>
    )
}

export default UserProfilePage
