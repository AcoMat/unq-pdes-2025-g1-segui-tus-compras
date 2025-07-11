import LoginForm from "../../components/forms/LoginForm/LoginForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";


function Login() {
    const { user } = useUserContext();
    let navigate = useNavigate();

    useEffect(()=> {
        if(user) {
            navigate('/profile');
        }
    },[user])

    return (
        <LoginForm/>
    );
}

export default Login;