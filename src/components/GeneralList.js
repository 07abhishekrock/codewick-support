import { faCaretLeft, faCaretRight, faFilter, faSearch, faSort } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect , useState } from "react";

const GeneralList = (props)=>{
    const [search_filter , set_search_filter]= useState('');
    const [search_value , set_search_value] = useState({
        search_key : '',
        search_string : ''
    });
    useEffect(()=>{
        if(props.options && props.options.search_options){
            const search_key = props.options.search_options[0].value;
            const search_string = search_value.search_string;
            const initial_search_filter = props.options.filter_options[0].value;


            props.set_search_query(`${search_key}[$regex]=^${search_string}&${search_key}[$options]=i&${initial_search_filter}`);
            set_search_value({ ...search_value , search_key});
            set_search_filter(initial_search_filter);
        }
    },[]) 
    return (
        <div className="general-box-wrapper">
            <div className="general-list-head" key={"head"}>
                <h2>{props.heading}</h2>
                <div className="search-filter-div">
                    {!props.no_search_bar ? 
                    <>
                        <div className="search">
                            <select onChange={(e)=>{
                                set_search_value({...search_value , search_key : e.target.value});
                            }}>
                                {props.options.search_options.map((option)=>{
                                    return <option key={option.value} value={option.value}>{option.label}</option>
                                })}
                            </select>
                            <input type="text" placeholder="Search Here" onChange={e => set_search_value({
                                search_key : search_value.search_key,
                                search_string : e.target.value})}/>
                            <i onClick={()=>{
                                props.set_search_query(`${search_value.search_key}[$regex]=^${search_value.search_string}&${search_value.search_key}[$options]=i&${search_filter}`);
                            }}><FontAwesomeIcon icon={faSearch}/></i>
                        </div> 
                    </>
                    : null}
                    {
                    props.noFilter ? null : 
                    <div className="options">
                        <select onChange={(e)=>{
                            props.set_search_query(`${search_value.search_key}[$regex]=^${search_value.search_string}&${search_value.search_key}[$options]=i&${e.target.value}`);
                            set_search_filter(e.target.value);
                        }}>
                            {props.options.filter_options.map((option)=>{
                                return <option value={option.value} key={option.value}>{option.label}</option>
                            })} 
                        </select> 
                    </div>
                    }
                </div>
            </div>
            <div className="general-list" key={"list"}>
                {props.children}
            </div>
            <div className="general-list-pagination" key={"pagination"}>
                <span onClick={props.onPrev}><FontAwesomeIcon icon={faCaretLeft}/>&nbsp;Prev Page</span>
                <span onClick={props.onNext}>Next Page&nbsp;<FontAwesomeIcon icon={faCaretRight}/></span>
            </div>
        </div>
    )
}

export const GeneralBoxWrapper = (props)=>{
    return (
        <div className="general-box-wrapper no-padding-at-smaller-screens" style={{width : props.width}}>
            {props.children}
        </div>
    )
}

export default GeneralList;