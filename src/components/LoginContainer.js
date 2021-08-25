const LoginContainer = ()=>{
    return (
        <div className="login-container">
            <h2>WELCOME TO <i>CODEWICK</i> SUPPORT</h2>
            <div className="login-form-input-group">
                <label htmlFor="username">Username</label>
                <input id="username" type="text"/>
            </div>
            <div className="login-form-input-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password"/>
            </div>
            <button>Login Now</button>
        </div>
    )
}

export default LoginContainer;