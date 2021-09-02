import axios from "axios";
import { useFormik } from "formik";
import { useHistory } from "react-router";
import * as yup from 'yup';
const LoginContainer = ({set_user_found})=>{
    const history = useHistory();
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
        onSubmit : async ()=>{
            try{
                const response = await axios.post('https://api-redmine.herokuapp.com/api/v1/user/login',login_form.values);
                const user_data = response.data && response.data.data.user;
                localStorage.setItem('token',response.data.token);
                localStorage.setItem('user',JSON.stringify(user_data));
                console.log('success');
                set_user_found(user_data);
            }
            catch(error){
                if(error.response.status == 401){
                    alert('invalid email or password');
                    return;
                }
                alert('try again later , seems like a problem with the server');
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