import { faCaretLeft, faCaretRight, faFilter, faSearch, faSort } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const GeneralList = (props)=>{
    return (
        <div className="general-box-wrapper">
            <div className="general-list-head">
                <h2>{props.heading}</h2>
                <div className="search-filter-div">
                    {!props.no_search_bar ? <div className="search">
                        <input type="text" placeholder="Search Here"/>
                        <FontAwesomeIcon icon={faSearch}/>
                    </div> : null}
                    <div className="options">
                        <span>New Issues</span>
                        <FontAwesomeIcon icon={faSort}/>
                    </div>
                </div>
            </div>
            <div className="general-list">
                {props.children}
            </div>
            <div className="general-list-pagination">
                <span><FontAwesomeIcon icon={faCaretLeft}/>&nbsp;Prev Page</span>
                <span>Next Page&nbsp;<FontAwesomeIcon icon={faCaretRight}/></span>
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