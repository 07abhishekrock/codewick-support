import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"
import { useRef , useState } from "react"
const NavbarWithSearch = ()=>{
    const [visible , setVisible] = useState(0);
    const search_bar_ref = useRef(null);
    return (
        <nav>
            <div className="logo-nav-wrapper">
                <div className="logo-with-label">
                    <i></i>
                    <h2>CODEWICK <i>SUPPORT</i></h2>
                    <div className="nav-links">
                        <a select="1">Home</a>
                        <a>My Page</a>
                        <a>Projects</a>
                        <a>Help</a>
                        <a onClick={(e)=>{
                            setVisible((visible + 1) % 2);
                        }}
                        ><FontAwesomeIcon icon={visible===0 ? faSearch : faTimes}/></a>
                    </div>
                </div>
            </div>
            <div className="search-bar" {...{visible}} tabIndex="1" ref={search_bar_ref}>
                <input type="text" placeholder="Search In Projects"/>
                <i><FontAwesomeIcon icon={faSearch}/></i>
            </div>
        </nav>
    )
}

export default NavbarWithSearch;