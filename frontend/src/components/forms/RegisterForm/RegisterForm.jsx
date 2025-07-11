import { useEffect, useState } from 'react';
import './RegisterForm.css'
import checklist from '../../../assets/ui/check-list.svg'
import loadingsvg from '../../../assets/ui/loading.svg'
import { useNavigate } from 'react-router-dom';
import EmailStep from './EmailStep.jsx';
import NameStep from './NameStep.jsx';
import PasswordStep from './PasswordStep.jsx';
import { useUserContext } from '../../../context/UserContext.jsx';
import UpsForm from '../UpsForm.jsx';

function RegisterForm() {
    const navigate = useNavigate();
    const { register } = useUserContext();

    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        password: '',
        image: ''
    });

    const registerStages = {
        email: 'email',
        password: 'password',
        name: 'name',
        creating: 'creating',
        created: 'created',
        error: 'error'
    }

    const [error, setError] = useState(null);

    const registerUser = async () => {
        try{
            await register(formData.name, formData.lastName, formData.email, formData.password);
            setCurrentStage(registerStages.created);
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            setError(error.message);
            setCurrentStage(registerStages.error);
        }
    }


    const [currentStage, setCurrentStage] = useState(registerStages.email);
    const [shouldRegister, setShouldRegister] = useState(false);
    
    useEffect(() => {
        if (shouldRegister && currentStage === registerStages.creating) {
            registerUser();
            setShouldRegister(false);
        }
    }, [shouldRegister, currentStage, formData]);
    
    const nextStage = async () => {
        switch (currentStage) {
            case registerStages.email:
                setCurrentStage(registerStages.name);
                break;
            case registerStages.name:
                setCurrentStage(registerStages.password);
                break;
            case registerStages.password:
                setCurrentStage(registerStages.creating);
                setShouldRegister(true);
                break;
            default:
                setCurrentStage(registerStages.email);
                setError(null);
        }
    }

    return (
        <div className='content-wrapper mx-auto register-form'>
            {
                currentStage === registerStages.email &&
                <EmailStep setFormData={setFormData} nextStage={nextStage} />
                || currentStage === registerStages.name &&
                <NameStep setFormData={setFormData} nextStage={nextStage} />
                || currentStage === registerStages.password &&
                <PasswordStep setFormData={setFormData} nextStage={nextStage} />
                || currentStage === registerStages.creating &&
                <div className='w-50 p-5 bg-body rounded mx-auto d-flex justify-content-center flex-column gap-4 text-center'>
                    <img className='mx-auto w-25 ml-blue-filter' src={loadingsvg} />
                    <h4>Procesando tus datos...</h4>
                </div>
                || currentStage === registerStages.created &&
                <div className='w-50 p-5 bg-body rounded mx-auto d-flex justify-content-center flex-column gap-4 text-center'>
                    <img src={checklist} className='ml-blue-filter w-50 mx-auto' />
                    <h3>¡Listo {formData.name}! Ya tenés tu cuenta</h3>
                </div>
                || currentStage === registerStages.error &&
                <UpsForm error={error} nextStage={nextStage} />
            }
        </div>
    )
};

export default RegisterForm;