import React, { useContext } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { LoadingContext } from '../utils/contexts';

function CreateTimeLogForm({show_create_log , issue_id , project_id}) {
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const time_log_form = useFormik({
        initialValues : {
            activity : "development",
            comment : "",
            hours : 0,
            minutes : 0 
        },
        validationSchema : yup.object({
            activity : yup.string().required().oneOf(["design","development"]),
            hours : yup.number().required().min(0),
            minutes : yup.number().required().min(0).max(59),
            comment : yup.string()
        }),
        onSubmit : async ({comment , hours , minutes , activity})=>{
            try{
                const log_data = {
                    comment , 
                    activity ,
                    hours : hours + Number((minutes / 60).toFixed(1)),
                    issue : issue_id , 
                    project : project_id,
                    user : JSON.parse(localStorage.getItem('user'))?._id
                }
                dispatch_load_obj(['load','Adding Time Log']);
                const response = await fetch('https://api-redmine.herokuapp.com/api/v1/log',{
                    method : "POST",
                    headers : {
                        "Authorization" : "Bearer " + localStorage.getItem('token'),
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify(log_data)
                })
                if(response.ok){
                    dispatch_load_obj(['info','Time Logged Succesfully']);
                }
                else{
                    dispatch_load_obj(['info','Some Error Occurred']);
                }
            }
            catch(e){
                dispatch_load_obj(['info','Some Error Occurred']);
            }
        }
    })
    return (
        <div className="modal-wrapper">
            <div className="modal-form-wrapper">
                <form className="modal-form" onSubmit={(e)=>{
                    e.preventDefault();
                    time_log_form.submitForm();
                }}>
                    <h3>Add Time Log</h3>
                    <div className="input-group">
                        <label htmlFor="activity-type">Activity</label>
                        <select id="activity-type" {...time_log_form.getFieldProps('activity')}>
                            <option value="development">Development</option>
                            <option value="design">Design</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="hours">Hours Spent</label>
                        <input type="number" id="hours" {...time_log_form.getFieldProps('hours')}/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="minutes">Minutes Spent</label>
                        <input type="number" id="minutes" {...time_log_form.getFieldProps('minutes')}/>
                    </div>
                    <div className="input-group single-column">
                        <label htmlFor="comment">Comment</label>
                        <textarea id="comment" {...time_log_form.getFieldProps('comment')}></textarea>
                    </div>
                    <ul className="error-container">
                        <li>{time_log_form.errors.activity}</li>
                        <li>{time_log_form.errors.comment}</li>
                        <li>{time_log_form.errors.hours}</li>
                        <li>{time_log_form.errors.minutes}</li>
                    </ul>
                    <div className="btn-group">
                        <button>Add Log</button>
                        <button style={{ background : "red" }} onClick={()=>show_create_log(false)}>Cancel Log</button>
                    </div>
                </form>
            </div> 
        </div>
    )
}

export default CreateTimeLogForm