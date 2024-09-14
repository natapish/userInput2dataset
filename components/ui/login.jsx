import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "933539192809-7pp84p4l4085lnttr9puggsa8ekv72k9.apps.googleusercontent.com"

function Login() {

    const onSuccess = (res) => {
        console.log('Login Success: currentUser:', res.profileObj);
    };

    const onFailure = (res) => {
        console.log('Login failed: res:', res);
    };

    return (
        <div id="signInButton">
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                    buttonText="Login"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    isLoggedIn={true}
                />
            </GoogleOAuthProvider>
            
        </div>
    )
}

export default Login;