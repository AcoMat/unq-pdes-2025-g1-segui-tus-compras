import avatarPlaceholder from '../../../assets/ui/profile-placeholder.png';
import { useNavigate } from 'react-router-dom';
import LargeBlueButton from '../../basic/LargeBlueButton/LargeBlueButton';
import SecundaryBtn from '../../basic/SecundaryBtn/SecundaryBtn';
import { useEffect, useState } from 'react';
import { emailRegex } from '../../../util/emailUtils';
import UpsForm from '../UpsForm';
import { useUserContext } from '../../../context/UserContext';

function LoginForm() {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState(null);
  const [password, setPassword] = useState("");

  const loginStages = { email: 0, password: 1, error: 2 }
  const [loginStage, setLoginStage] = useState(loginStages.email);

  const { login } = useUserContext();
  const [loginError, setLoginError] = useState(null);

  const loginUser = async () => {
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setLoginError(error.message);
      setLoginStage(loginStages.error);
    } finally {
      setLoading(false);
    }
  }

  const nextStage = () => {
    switch (loginStage) {
      case loginStages.email:
        if (emailRegex.test(email)) {
          setLoginStage(loginStages.password);
        } else {
          setFormError("Por favor, ingrese un email válido");
        }
        break;
      case loginStages.password:
        if (password.trim() == "") {
          setFormError("Ingrese su contraseña")
        } else {
          loginUser();
        }
        break;
      case loginStages.error:
        setLoginStage(loginStages.email);
        break;
      default:
        setLoginStage(loginStages.email);
        break
    }
  }

  return (
    <div className='content-wrapper'>
      {
        loginStage == loginStages.error ?
          <div className='mt-5'>
            <UpsForm error={loginError} nextStage={nextStage} />
          </div>
          :
          <div className='d-flex flex-column justify-content-center flex-md-row bg-body rounded my-3 p-4 m-md-5 p-md-5'>
            <div className='w-100'>
              <h2 className='pe-5'>
                {
                  loginStage === loginStages.email &&
                  'Ingresá tu e-mail o teléfono para iniciar sesión'
                }
                {
                  loginStage === loginStages.password &&
                  'Ingresá tu contraseña de Mercado Libre'
                }
              </h2>
              {loginStage === loginStages.password &&
                <div className="d-flex rounded-pill w-50 border mt-3">
                  <img className='object-fit-cover rounded-circle me-2' width={30} src={avatarPlaceholder} alt="user" />
                  <div className='d-flex flex-column'>
                    <span className='fs-075' style={{ textOverflow: "ellipsis" }}>{email}</span>
                    <a className='fs-075' onClick={() => setLoginStage(loginStages.email)} style={{ cursor: "pointer" }}>Cambiar cuenta</a>
                  </div>
                </div>
              }
            </div>
            <div className='w-100 w-md-100'>
              <div className='border rounded px-md-4 py-md-2 pb-md-4'>
                <label>{
                  loginStage === loginStages.email &&
                  'E-mail o teléfono'
                }
                  {
                    loginStage === loginStages.password &&
                    'Contraseña'
                  }</label>
                {loginStage === loginStages.email ?
                  <>
                    <input name='email' className='w-100' value={email} onChange={(e) => { setEmail(e.target.value); setFormError(false) }} />
                    {formError && <label className='error'>{formError}</label>}
                  </>
                  :
                  loginStage === loginStages.password ?
                    <>
                      <input name='password' className='w-100' type='password' value={password} onChange={(e) => { setPassword(e.target.value); setFormError(null) }} />
                      {formError && <label className='error'>{formError}</label>}
                    </>
                    :
                    null
                }
                {loginStage === loginStages.email ?
                  <div className='d-flex flex-column gap-3 mt-4'>
                    <LargeBlueButton text='Continuar' onClick={() => nextStage()} />
                    <SecundaryBtn text="Crear cuenta" onClick={() => { navigate("/register") }} />
                  </div>
                  :
                  loginStage === loginStages.password ?
                    <div className='d-flex gap-3 mt-4'>
                      <div className='w-50'>
                        <LargeBlueButton text='Iniciar sesión' onClick={nextStage} loading={loading} />
                      </div>
                      <div className='w-50'>
                        <SecundaryBtn text="¿Olvidaste tu contraseña?" onClick={() => navigate("/error")} />
                      </div>
                    </div>
                    :
                    null
                }
              </div>
            </div>
          </div>
      }
    </div>
  );
}

export default LoginForm;
