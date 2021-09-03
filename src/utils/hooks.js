import { useEffect, useState } from "react";

export const useFetch = (url , method , isSecure , headers , pre_request_callback ,  success_callback , failure_callback , blockingParamValue=true)=>{
    const [response , set_response] = useState(null);
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
                set_response(null);
                failure_callback(
                    obtained_response.statusText,
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