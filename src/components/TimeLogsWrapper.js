import { faClock, faPenAlt } from "@fortawesome/free-solid-svg-icons"
import { faTrashAlt as faTrash } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import GeneralList from "./GeneralList"
import { useFetch } from "../utils/hooks"
import { useContext , useState } from "react"
import { LoadingContext } from "../utils/contexts"

export const TimeLogSingle = ({
    id,
    activity,
    comment,
    hours,
    issue,
    createdAt,
    user,
    deleteLog,
    isDeletable
})=>{

    const hours_part = hours ? Math.floor(hours) : "0";
    const minutes_part = hours ? Math.trunc((hours - hours_part) * 60) : "0"
    const [ , dispatch_load_obj] = useContext(LoadingContext)

    const deleteTimeLog = async ()=>{
        try{
            dispatch_load_obj(['load','Deleting Log Item']);
            const response = await fetch('https://api-redmine.herokuapp.com/api/v1/log/' + id , {
                method : 'DELETE',
                headers : {
                    'Authorization' : "Bearer " + localStorage.getItem('token')
                }
            });
            if(response.ok){
                deleteLog(id);
                dispatch_load_obj(['info','Deleted Succesfully']);
            }
            else{
                dispatch_load_obj(['info','Some Error Occurred']);
            }
        }
        catch(e){
            dispatch_load_obj(['info','Some Error Occurred']);
        }
    }

    return (
        <div className="time-log-single">
            <div className="time-log-clock">
                <FontAwesomeIcon icon={faClock}/>
                <span className="total-time-taken">{hours_part}:{minutes_part} Hrs</span>
                <span className="work-type">{activity}</span>
            </div>
            <div className="time-log-info-wrapper">
                <div className="time-log-info">
                    <h3><a>{user.name}</a> worked on Issue #{issue.counter} on <a>{(new Date(createdAt)).toLocaleDateString('en-GB')}</a></h3>
                    <p>{issue.title}</p>
                    <div className="comment">
                        {comment}
                    </div>
                </div>
                {isDeletable ? 
                <div className="time-log-options">
                    <i onClick={deleteTimeLog}><FontAwesomeIcon icon={faTrash}/></i>
                </div>
                :null
                }
            </div>
        </div>
    )
}


const TimeLogsWrapper = (props)=>{
    const [,dispatch_load_obj] = useContext(LoadingContext);
    const [time_logs_data , set_time_logs_data] = useState([]);
    const current_user_role = JSON.parse(localStorage.getItem('user')).role;
    useFetch('https://api-redmine.herokuapp.com/api/v1/log','GET',true,{},
    ()=>{
        dispatch_load_obj(['load','Loading Time Entries']); 
    }, 
    (data)=>{
        const time_logs_list = data.data.data;
        set_time_logs_data(time_logs_list);
        dispatch_load_obj(['idle']);
    },
    (error)=>{
        dispatch_load_obj(['error',{
            error,
            onRetry : ()=>{}
        }])
    } 
    )
    return (
        <GeneralList no_search_bar heading={"Time Logs"}>
            {time_logs_data.map((time_log)=>{
               return <TimeLogSingle key={time_log.id} {...time_log} deleteLog={(id)=>{
                set_time_logs_data(time_logs_data.filter(time_log => time_log.id !== id));
               }} isDeletable={current_user_role === 'admin' ? true : false}/>
            })}
        </GeneralList>
    )
}


export default TimeLogsWrapper;