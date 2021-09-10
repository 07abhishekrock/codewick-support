import { faCircleNotch, faExclamationCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React , { useContext } from 'react'

function LoadingModal({load_object : {
    loading,
    loadingText,
    error,
    retryCallback,
    buttonText,
    buttonCallback
}, dispatch_load_object : dispatch_load_obj}) {
    console.log(buttonText , buttonCallback);
    return (loading !== 'idle' || error || loading === 'info' ? <div className="modal-wrapper loading-wrapper" info={loading === 'info' ? "1" : "0"}>
            <div className="loading-modal" error = {error ? "1" : "0"} info={loading === 'info' ? "1" : "0"} load={loading === 'load' ? "1" : "0"}>
                {error && !buttonText ? <FontAwesomeIcon icon={faTimesCircle}/> : null}
                {buttonText ? <FontAwesomeIcon icon={faExclamationCircle}/> : null}
                {loading === 'load' ? <FontAwesomeIcon icon={faCircleNotch}/> : null}
                {loading === 'info' ? <FontAwesomeIcon icon={faExclamationCircle}/> : null}
                <p>{loadingText || error}</p>
                {loading === 'info' ? <button onClick={()=>dispatch_load_obj(['idle'])}>Close</button> : null} 
                {loading === 'error' && !buttonText ? <button onClick={retryCallback}>Retry</button> : null}
                {buttonText ? <button onClick={buttonCallback}>{buttonText}</button> : null}
            </div> 
        </div> : null
    )
}

export default LoadingModal;
