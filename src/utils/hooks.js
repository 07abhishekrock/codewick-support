import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "./contexts";

export const useFetch = (url , method , isSecure , headers , pre_request_callback ,  success_callback , failure_callback , blockingParamValue=true)=>{
    const [response , set_response] = useState(null);
    const [,dispatch_load_obj] = useContext(LoadingContext);
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
                if(error_obj.error.statusCode === 500 || error_obj.error.statusCode === 401){
                    dispatch_load_obj(['error' , {
                        error : error_obj.message,
                        buttonText : "Login Now",
                        buttonCallback : ()=>{
                            localStorage.removeItem('user');
                            dispatch_load_obj(['idle']);
                            window.location.reload();
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