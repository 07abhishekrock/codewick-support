import { useFormik } from "formik";
import { useHistory } from "react-router";
import * as yup from 'yup';
const LoginContainer = ({set_user_found})=>{
    const login_form = useFormik({
        initialValues : {
            email : '',
            password : ''
        },
        validationSchema : yup.object({
            email : yup.string().required('Email Field is Required').email('Invalid Email Provided'),
            password : yup.string().required('Password is Required')
        }),
        validateOnBlur : false,
        validateOnChange : false,
        onSubmit : async (values)=>{
            console.log(values);
            try{
                const response = await fetch('https://api-redmine.herokuapp.com/api/v1/user/login',
                {
                    method : 'POST',
                    body : JSON.stringify(values),
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                });
                if(response.ok){
                    const user_data = await response.json();
                    localStorage.setItem('token',user_data.token);
                    localStorage.setItem('user',JSON.stringify(user_data.data.user));
                    set_user_found(user_data.data.user);
                }
                else if(response.status == 401){
                    alert('Invalid email or password');
                }
                console.log('success');
            }
            catch(error){
                alert(error.message);
            }
        }
    })

    return (
        <div className="login-container">
            <h2>WELCOME TO <i>CODEWICK</i> SUPPORT</h2>
            <form onSubmit={(e)=>{
                e.preventDefault();
                login_form.submitForm();
            }}>
                <div className="login-form-input-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" {...login_form.getFieldProps('email')}/>
                    <i>{login_form.errors.email}</i>
                </div>
                <div className="login-form-input-group">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" {...login_form.getFieldProps('password')}/>
                    <i>{login_form.errors.password}</i>
                </div>
                <button>Login Now</button>
            </form>
        </div>
    )
}

export default LoginContainer;