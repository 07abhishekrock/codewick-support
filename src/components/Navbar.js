import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faTimes, faUser } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useRef , useState } from "react"
import { Link, useLocation, useRouteMatch } from "react-router-dom"

function includesMultiple(target_array , ...target_values){
    let contains = false;
    target_values.every((element)=>{
        if(target_array.includes(element)){
            contains = true;
            return false;
        }
        return true;
    })
    return contains;
}

const NavbarWithSearch = ()=>{
    const [visible , setVisible] = useState(0);

    const [current_selected , set_currently_selected] = useState(2);
    const routes_array = useLocation().pathname.split('/');
    useEffect(()=>{
        const includesBind = includesMultiple.bind(null , routes_array.slice(1));
        if(includesBind('')){
            set_currently_selected(2);
        }
        if(includesBind('project' , 'projects')){
            set_currently_selected(3);
        }
        if(includesBind('issue' , 'issues')){
            set_currently_selected(6);
        }
        if(includesBind('admin')){
            set_currently_selected(5);
        }
    },[routes_array])

    const search_bar_ref = useRef(null);
    const user_object = JSON.parse(localStorage.getItem('user'));
    return (
        <nav>
            <div className="user-widget" tabIndex="1">
                <i><FontAwesomeIcon icon={faUser}/></i>
                <span>{JSON.parse(localStorage.getItem('user')).name}</span>
                <span>Logout</span>
            </div>
            <div className="logo-nav-wrapper">
                <div className="logo-with-label">
                    <i></i>
                    <h2>CODEWICK <i>SUPPORT</i></h2>
                    <div className="nav-links">
                        <Link select={current_selected === 1 ? "1" : "0"} to="/home">Home</Link>
                        <Link select={current_selected === 2 ? "1" : "0"} to="/">My Page</Link>
                        <Link select={current_selected === 3 ? "1" : "0"} to="/projects">Projects</Link>
                        <Link select={current_selected === 4 ? "1" : "0"} to="/help">Help</Link>
                        {user_object.role === 'admin' ? <Link select={current_selected === 5 ? "1" : "0"} to="/admin">Admin</Link> : null}
                        <Link select={current_selected === 6 ? "1" : "0"} to="/issues">Issues</Link>
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