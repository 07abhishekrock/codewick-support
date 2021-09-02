import React, { useEffect } from 'react'
import { useLocation } from 'react-router';

function URLChecker({set_user_found}) {
    const location = useLocation();
    useEffect(()=>{
        if(!(localStorage.getItem('token') && localStorage.getItem('user'))){
            set_user_found(null);
        }
    },[location])
    return null;
}

export default URLChecker
