import React from 'react'

function UserProfilePage() {
    return (
        <div className="user-profile-page">
            <div className="user-profile-image">
                <img src="https://images.unsplash.com/photo-1614502875832-77fe801288ba?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fHByb2ZpbGUlMjBwaWN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60"/>
                <input type="file"/>
            </div>
            <div className="user-profile-input-group">
                <label>Name</label>
                <input type="text"/>
            </div>
            <div className="user-profile-input-group">
                <label>Email</label>
                <input type="text"/>
            </div>
            <div className="user-profile-input-group">
                <label>Phone Number</label>
                <input type="text"/>
            </div>
            <button>Update</button>
        </div>
    )
}

export default UserProfilePage
