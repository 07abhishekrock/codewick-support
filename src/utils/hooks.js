import { useContext, useEffect, useState } from "react";
import { LoadingContext, UserContext } from "./contexts";

export const useFetch = (url , method , isSecure , headers , pre_request_callback ,  success_callback , failure_callback , blockingParamValue=true)=>{
    const [response , set_response] = useState(null);
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const [,set_user_object] = useContext(UserContext);
    useEffect(async ()=>{
        try{
            if(!blockingParamValue) return;
            pre_request_callback();
            const obtained_response = await fetch(url  , {
                method, 
                cache : 'no-cache',
                headers : {
                    'Authorization' : "Bearer " + localStorage.getItem('token'),
                    ...headers,
                },
            });
            if(obtained_response.ok){
                const data = await obtained_response.json();
                set_response(data);
                success_callback(data);
            }
            else{
                const error_obj = await obtained_response.json();
                if(obtained_response.status === 401){
                    dispatch_load_obj(['error' , {
                        error : error_obj.message,
                        buttonText : "Login Now",
                        buttonCallback : ()=>{
                            localStorage.removeItem('user');
                            dispatch_load_obj(['idle']);
                            set_user_object(null);
                        },
                        onRetry : null
                    }])
                    return;
                }
                set_response(null);
                failure_callback(
                    error_obj.message
                );
            }
        }
        catch(e){
            console.error(e);
            set_response(null);
            failure_callback(e.message)
        }
    },[url , blockingParamValue])

    return response;
}


export const useLoggedOutAlert = ()=>{

    const [,set_user_object] = useContext(UserContext);
    const [,dispatch_load_object] = useContext(LoadingContext);

    return async (response)=>{
        const error_obj = await response.json();
        if(response.status === 401){
            dispatch_load_object(['error' , {
                error : error_obj.message,
                buttonText : "Login Now",
                buttonCallback : ()=>{
                    localStorage.removeItem('user');
                    dispatch_load_object(['idle']);
                    set_user_object(null);
                },
                onRetry : null
            }])
        }
        else{
            dispatch_load_object(['info','Some Error Occurred']);
        }
    }
}