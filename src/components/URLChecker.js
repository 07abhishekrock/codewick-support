import {useLocation} from 'react-router'
function URLChecker() {
    const location = useLocation();
    console.log('last path was' + location.pathname);
    return null;
}

export default URLChecker
