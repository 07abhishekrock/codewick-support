import { useState , useRef, useEffect } from "react";
import { useLoggedOutAlert } from "../utils/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// const operations = [
//     {
//         label : 'Add As User',
//         onClick : ()=>{},
//         isEnabled : ()=>{}
//     },
// ]

export const createAndDispatchClearEvent = (identifier)=>{
    const event = new Event("clear:"+identifier , {})
    document.dispatchEvent(event);
}

function SearchBoxWithList({
    searchURLGenerator , 
    selectItem, // function that helps select a certain item.
    isSelected,
    operationsOnItems,
    added_list_heading,
    getDataFromResponse,
    selectedItems,
    nameAttribute,
    identifier
}){


    useEffect(()=>{
        const listener = (e)=>{
            console.log('event found' , identifier);
            set_search_list([]);
            search_input.current.value = "";
        };
        document.addEventListener('clear:'+identifier  ,listener)
        return ()=>{
            document.removeEventListener('clear:'+identifier ,listener);
        }
    },[])

    const [search_list , set_search_list] = useState([]);
    const search_input = useRef(null);
    const [loading , set_loading] = useState(false);
    const typing_timeout = useRef(null);
    const logged_out_dialog = useLoggedOutAlert();

    return (
        <>
        <div className="search-bar-with-list">
            <div className="inner-search-bar">
                <FontAwesomeIcon icon={faSearch}/>
                <input type="text" ref={search_input} placeholder="Start Typing Names ..." onKeyPress={(e)=>{
                    if(e.key === 'Enter') e.preventDefault(); 
                }} onChange={(e)=>{
                    e.preventDefault();
                    clearTimeout(typing_timeout.current);
                    if(e.target.value.trim()){
                        typing_timeout.current = setTimeout(async ()=>{
                            try{
                                set_loading(true);
                                const response = await fetch(searchURLGenerator(e.target.value.trim()), 
                                {
                                    method : 'GET',
                                    headers : {
                                        "Authorization" : "Bearer " + localStorage.getItem('token')
                                    }
                                });
                                if(response.ok){
                                    const data = await response.json();
                                    set_search_list(getDataFromResponse(data));
                                    set_loading(false);
                                }
                                else{
                                    await logged_out_dialog(response);
                                }
                            } 
                            catch(e){
                                console.error(e);
                            }
                        } , 800)
                    }
                }}/>
            </div>
            <div className="search-list">
                {
                loading ? <h1>Loading Results...</h1> : search_list.map((item)=>{
                    if(!isSelected(item)){
                        return (
                            <div className="search-list-item" key={item._id}>
                            {item[nameAttribute]}
                            <span onClick={()=>{
                               selectItem(item); 
                            }}>Select</span>
                        </div>
                        )
                    }
                    return (
                        <div className="search-list-item" key={item._id}>
                            {item[nameAttribute]}
                            <span>Selected</span>
                        </div>
                    )
                })}
                {!loading && search_list.length === 0 ? <h1>No Results Found</h1> : null}
            </div>
        </div>
        <h3>{added_list_heading || 'Added Items'}</h3>
        <div className="selected-items">
            {selectedItems.map((item)=>{
                return <div key={item._id}>
                    {item[nameAttribute]}
                    &nbsp;
                    <div className="btn-grp">
                        {operationsOnItems.map((operation)=>{
                            if(operation.isEnabled(item)){
                                return <button key={operation.label} onClick={(e)=>{
                                    e.preventDefault();
                                    operation.onClick(item);
                                }}>{operation.label}</button>
                            }
                        })}
                    </div>
                </div>
            })}
        </div>
        </>
    )
}

export default SearchBoxWithList;