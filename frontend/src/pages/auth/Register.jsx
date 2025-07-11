import { useEffect } from "react";
import RegisterForm from "../../components/forms/RegisterForm/RegisterForm";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

function Register() {
    const navigate = useNavigate();
    const { user } = useUserContext();

    useEffect(() => {
        if(user){
            navigate('/profile');
        }
    }, [user]);

    return (
        <RegisterForm/>
    )
}

export default Register;