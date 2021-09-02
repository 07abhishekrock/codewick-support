import { faCircleNotch, faExclamationCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadingContext } from '../utils/contexts';
import React , { useContext } from 'react'

function LoadingModal() {
    const [{
        loading, 
        error , 
        loadingText ,
        retryCallback
    } , dispatch_load_obj] = useContext(LoadingContext);
    return (loading !== 'idle' || error || loading === 'info' ? <div className="modal-wrapper loading-wrapper">
            <div className="loading-modal" error = {error ? "1" : "0"} info={loading === 'info' ? "1" : "0"}>
                {error ? <FontAwesomeIcon icon={faTimesCircle}/> : null}
                {loading === 'load' ? <FontAwesomeIcon icon={faCircleNotch}/> : null}
                {loading === 'info' ? <FontAwesomeIcon icon={faExclamationCircle}/> : null}
                <p>{loadingText || error}</p>
                {loading === 'info' ? <button onClick={()=>dispatch_load_obj(['idle'])}>Close</button> : <button onClick={retryCallback}>Retry</button>}
            </div> 
        </div> : null
    )
}

export default LoadingModal;
