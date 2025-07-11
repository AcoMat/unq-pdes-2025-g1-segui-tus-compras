import { useEffect, useState } from "react";
import BlueButton from "../../../components/basic/BlueButton/BlueButton";


export default function CardDetailsStage({ setFormData, formData, nextStage }) {
    const [formError, setFormError] = useState(null);

    const formatCardNumber = (value) => {
        return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    };

    const handleCardNumberChange = (e) => {
        const formattedValue = formatCardNumber(e.target.value);
        setFormData((prevData) => ({ ...prevData, cardNumber: formattedValue }));
    };

    const handleExpirationDateChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 6) {
            value = value.slice(0, 6);
        }
        if (value.length >= 4) {
            const month = parseInt(value.slice(4, 6), 10);
            if (month > 12) {
                value = value.slice(0, 4) + 12;
            }
        }
        if (value.length > 4) {
            value = value.slice(0, 4) + '/' + value.slice(4);
        }
        setFormData((prevData) => ({ ...prevData, expirationDate: value }));
    };

    const handleCVVChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) {
            value = value.slice(0, 3);
        }
        setFormData((prevData) => ({ ...prevData, cvv: value }));
    }

    useEffect(() => {
        setFormError(null);
    }, [formData])

    const handleConfirm = () => {
        if (formData.cardNumber.length < 19 || formData.name.length < 1 || formData.expirationDate.length < 5 || formData.cvv.length < 3) {
            setFormError("Por favor, completá todos los campos");
            return;
        } else {
            nextStage();
        }
    }

    return (
        <>
            <h2 className="my-4 mx-md-0 mx-3">ingresá una nueva tarjeta</h2>
            <div className="bg-body p-4 bg-opacity-25 my-4 rounded">
                <img className="bg-body rounded-circle p-2" src={null} />
                <span className="mx-3">Nueva tarjeta de {formData.cardType}</span>
            </div>
            <div className="d-flex flex-md-row flex-column bg-body rounded shadow-sm p-4 my-4 pb-5">
                <div className="px-4 d-flex flex-column" style={{ maxWidth: "1000px" }}>
                    {formError && <label className="error">{formError}</label>}
                    <label className="form-label" htmlFor="cardNumber">Número de tarjeta</label>
                    <input className="form-control" type="text" id="cardNumber" value={formData.cardNumber} onChange={handleCardNumberChange} />
                    <label className="form-label" htmlFor="name">Nombre y Apellido</label>
                    <input className="form-control" type="text" id="name" maxLength="40" onChange={(e) => setFormData((prevData) => ({ ...prevData, name: e.target.value }))} />
                    <div className="d-flex gap-4">
                        <div className="w-50 d-flex flex-column justify-content-end">
                            <label className="form-label" htmlFor="expirationDate">Fecha de vencimiento</label>
                            <input className="form-control" type="text" id="expirationDate" value={formData.expirationDate} onChange={handleExpirationDateChange} />
                        </div>
                        <div className="w-50 d-flex flex-column justify-content-end">
                            <label className="form-label" htmlFor="cvv">CVV</label>
                            <input className="form-control" type="number" id="cvv" maxLength="3" value={formData.cvv} onChange={handleCVVChange} />
                        </div>
                    </div>
                    <label className="form-label" htmlFor="dni">DNI del titular</label>
                    <input disabled className="form-control" type="number" id="dni" onChange={(e) => setFormData((prevData) => ({ ...prevData, dni: e.target.value }))} />
                </div>
                <div className="d-flex flex-column justify-content-center mx-auto position-relative my-md-0 my-4" style={{ maxWidth: "400px" }}>
                    <span className="position-absolute p-md-5 z-1 fs-5" style={{ bottom: "27%", left: "6%", letterSpacing: "0.2rem" }}>{formData.cardNumber || "**** **** **** ****"}</span>
                    <span className="position-absolute p-md-5 z-1" style={{ bottom: "17%", left: "5%" }}>{formData.name || "NOMBRE Y APELLIDO"}</span>
                    <span className="position-absolute p-md-5 z-1" style={{ bottom: "17%", right: "5%" }}>{formData.expirationDate || "MM/AA"}</span>
                    <img src={null} className="img-fluid p-md-5 align-self-center z-0" />
                </div>
            </div>
            <div className="d-flex justify-content-end mb-4">
                <BlueButton text="Confirmar" onClick={handleConfirm} />
            </div>
        </>
    )
}