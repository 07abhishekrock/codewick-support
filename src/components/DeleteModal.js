import React from 'react'
import { useState } from 'react';

function DeleteModal({
    BtnLabel,
    YesLabel,
    NoLabel,
    caption,
    onDelete
}) {
    const [visible , set_visible] = useState(false);
    return (
        <div className="delete-modal" enabled={visible ? "1" : "0"}>
            <button onClick={(e)=>{
                e.preventDefault();
                set_visible(true);
            }}>{BtnLabel || 'Delete'}</button> 
            <div className="popup">
                <p>{caption || 'Are You Sure, You want to delete ??'}</p>
                <div className="popup-btns">
                    <button onClick={(e)=>{
                        e.preventDefault();
                        onDelete();
                    }}>{YesLabel || 'Yes'}</button>
                    <button onClick={(e)=>{
                        e.preventDefault();
                        set_visible(false);
                    }}>{NoLabel || 'No'}</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal