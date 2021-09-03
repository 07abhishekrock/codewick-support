import { useLocation } from 'react-router';
import { useFetch } from '../utils/hooks';

function URLChecker({set_user_found , user_found}) {
    const location = useLocation();
    console.log('another request');
    useFetch(`https://api-redmine.herokuapp.com/api/v1/user?name=none` , 'GET', true , {} , 
        ()=>{},
        ()=>{
            //ok response means user is still valid
            if(user_found && user_found._id){
                return;
            }
            if(localStorage.getItem('user') && localStorage.getItem('token')){
                set_user_found(JSON.parse(localStorage.getItem('user')));
            }
        },
        ()=>{
            console.log('hello world');
            set_user_found(null);
        }
    )
    return null;
}

export default URLChecker
