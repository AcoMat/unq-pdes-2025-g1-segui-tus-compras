import { useRef, useState } from "react";
import BlueButton from "../../basic/BlueButton/BlueButton";

export default function NameStep({ setFormData, nextStage }) {
    const nameRef = useRef(null);
    const lastNameRef = useRef(null);
    const [error, setError] = useState(null);

    const validateForm = () => {
        if (nameRef.current.value.trim() === '' || lastNameRef.current.value.trim() === '') {
            setError("Por favor, ingrese un nombre y apellido");
        } else {
            setFormData((prevData) => ({
                ...prevData,
                name: nameRef.current.value,
                lastName: lastNameRef.current.value
            }));
            nextStage();
        }
    }

    return (
        <>
            <h4>Elige cómo quieres que te llamemos</h4>
            <p>Verán el nombre que elijas todas las personas que interactúen contigo en Mercado Libre y Mercado Pago</p>
            <div className='d-flex flex-column bg-body rounded p-4'>
                <div className='d-flex gap-5'>
                    <div className='d-flex flex-column w-50'>
                        <label>
                            Nombre
                        </label>
                        <input name='name' ref={nameRef} onChange={() => setError(null)} className={`${error ? 'error' : ''}`} />
                    </div>
                    <div className='d-flex flex-column w-50'>
                        <label>
                            Apellido
                        </label>
                        <input name='lastName' ref={lastNameRef} onChange={() => setError(null)} className={`${error ? 'error' : ''}`}/>
                    </div>
                </div>
                {error && <label className='error'>{error}</label>}
            </div>
            <div className='mt-3 d-flex justify-content-end'>
                <BlueButton text='Continuar' onClick={validateForm} />
            </div>
        </>
    )
}