import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown , faTerminal } from "@fortawesome/free-solid-svg-icons";
import { useEffect , useRef } from "react";

export const sampleNoteItem = {
    editor : {
        name : 'Alok Puri',
        role : 'Manager',
    },
    dateUpdated : "3 Days Ago",
    noteMarkup : `
        <ul>
            <li>First item</li> 
            <li>Second item</li> 
            <li>Third item</li> 
            <li>Fourth item</li> 
        </ul>
    `
};


const SingleNoteItem = ({editor : {name , role} , dateUpdated , noteMarkup})=>{
    const data_ref = useRef(null);
    useEffect(() => {
        data_ref.current.innerHTML = noteMarkup;
    }, [])
    return <div className="single-note-item-wrapper">
        <div className="single-note-item-profile">
            {role === "Manager" ? <i manager="1">
                <FontAwesomeIcon icon={faCrown}/>
            </i> : <i developer="1">
                <FontAwesomeIcon icon={faTerminal}/>     
            </i>}
            <span>{name}</span>
            <span>{dateUpdated}</span>
        </div>
        <div className="single-note-item-data" ref={data_ref}>
        </div>
    </div>
}

export default SingleNoteItem;