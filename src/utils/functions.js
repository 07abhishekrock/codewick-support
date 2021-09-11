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

export const removeUnwantedNewLines = (input_text)=>{
    let flag = 0;
    const all_line_break_segments = input_text.split('<p><br></p>');
    const new_segments = []; 
    all_line_break_segments.forEach((segment)=>{
        if(segment === '' && flag === 0){
            flag = 1;
        }
        else if(segment === '' && flag !== 0){
            new_segments.push(segment); 
        }
        else{
            flag = 0;
            new_segments.push(segment);
        }
    })
    return new_segments.join('<p><br></p>');
}