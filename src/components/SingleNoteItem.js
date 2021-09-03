import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect , useRef } from "react";




export const sampleNoteItem = {
    user : {
        name : 'Alok Puri',
        id : '12',
        role : 'admin',
    },
    dateUpdated : "3 Days Ago",
    notes : `
        <ul>
            <li>First item</li> 
            <li>Second item</li> 
            <li>Third item</li> 
            <li>Fourth item</li> 
        </ul>
    `
};


const SingleNoteItem = ({user , updatedAt , notes , children ,isEditable })=>{
    const data_ref = useRef(null);
    useEffect(() => {
        if(!isEditable){
            data_ref.current.innerHTML = notes;
        }
    }, [])
    return <div className="single-note-item-wrapper">
        <div className="single-note-item-profile">
            <i>
                <FontAwesomeIcon icon={faUser}/>     
            </i>
            <span>{user && user.name || "no name"}</span>
            <span>{(new Date(updatedAt)).toDateString()}</span>
        </div>
        <div className="single-note-item-data" ref={data_ref} noborder={isEditable ? "1" : "0"}>
            {children}
        </div>
    </div>
}

export default SingleNoteItem;