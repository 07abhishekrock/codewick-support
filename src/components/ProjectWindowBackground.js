import CustomSVGIcon from "./CustomSVGIcon";
import image from '../icons/Union.svg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useState , createContext } from "react";
import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";

const ProjectPageContext = createContext();

const projectOptions = [
    {
        label : "overview",
        to : "overview"
    },
    {
        label : "issues",
        to : 'issues'
    },
    {
        label : "activity",
        to : 'activity'
    },
    {
        label : "roadmap",
        to : 'roadmap'
    },
    {
        label : "Settings",
        to : 'settings'
    },
]

const useUrlEndpoint = ()=>{
    const url_object = useLocation();
    if(url_object.pathname.split('/').includes('project')){
        const found_endpoint = projectOptions.filter(option => option.to == url_object.pathname.split('/')[3])
        return found_endpoint[0];
    }
    return false; 
}

const ProjectWindowWithBackground = (props)=>{

    const {project_name} = useParams();
    const convertedToUrl = useUrlEndpoint();
    const [collapsed , set_collapsed] = useState(false);

    return (
            <div className="project-background">
                {convertedToUrl &&
                    <div className="project-options-wrapper">
                        <span onClick={()=>set_collapsed(!collapsed)}>{convertedToUrl.label}<CustomSVGIcon iconURL={image}/></span>
                        <div className="project-options" visible={collapsed ? "1" : "0"}>
                            {
                                projectOptions.map((projectOption , index)=>{
                                    if(convertedToUrl.label !== projectOption.label){
                                        return <Link to={'/project/' + project_name + '/' +  projectOption.to} onClick={set_collapsed.bind(null , false)} key={index}>{projectOption.label}<FontAwesomeIcon icon={faArrowUp}/></Link>
                                    }
                                })
                            }
                        </div>
                    </div>
                }
                <div className="project-container">
                    {props.children}
                </div>
            </div>
    )
}

export {ProjectPageContext};

export default ProjectWindowWithBackground;