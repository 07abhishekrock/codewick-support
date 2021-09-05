export const logged_out_dialog = async (dispatch_load_object , response)=>{
    const error_obj = await response.json();
    if(response.status === 401){
        dispatch_load_object(['error' , {
            error : error_obj.message,
            buttonText : "Login Now",
            buttonCallback : ()=>{
                localStorage.removeItem('user');
                dispatch_load_object(['idle']);
            },
            onRetry : null
        }])
    }
    else{
        dispatch_load_object(['info','Some Error Occurred']);
    }
}