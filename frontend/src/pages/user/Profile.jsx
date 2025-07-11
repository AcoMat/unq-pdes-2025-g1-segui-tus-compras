import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import LoadingSwitch from "../../components/basic/LoadingSwitch/LoadingSwitch";
import ProfileData from "../../components/user/ProfileData/ProfileData";

function Profile() {
    const { user, loading } = useUserContext();
    let navigate = useNavigate();

    useEffect(()=> {
        if(!loading && !user) {
            navigate('/login');
        }
    },[user, loading])

    return (
        <LoadingSwitch loading={loading}>
            <ProfileData user={user} />
        </LoadingSwitch>
    );
}

export default Profile;