import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";
import { useState } from "react";
import checklist from "../../assets/ui/check-list.svg";
import PurchaseSumary from "../../components/purchase/PurchaseSumary";
import ChoosePaymentStage from "../../components/purchase/ChoosePaymentStage";
import UpsForm from "../../components/forms/UpsForm.jsx";

export default function Checkout() {
    let navigate = useNavigate();
    const { cart, purchaseCart } = useCartContext();
    const [error, setError] = useState(null);

    const formStages = {
        choosePayment: 0,
        purchasing: 1,
        purchased: 2,
        error: -1,
    }
    const [currentStage, setCurrentStage] = useState(formStages.choosePayment);

    const confirmPurchase = async () => {
        setCurrentStage(formStages.purchasing);
        try {
            await purchaseCart();
            setCurrentStage(formStages.purchased);
            setTimeout(() => {
                navigate("/purchases");
            }, 1500);
        } catch (error) {
            console.error("Error al procesar la compra:", error.message);
            setCurrentStage(formStages.error);
            setError(error.message || error.response.data || "Hubo un error al procesar tu compra. Por favor, intenta nuevamente.");
        }
    }

    const retry = () => {
        setCurrentStage(formStages.choosePayment);
        setError(null);
    }


    return (
        <div className='content-wrapper'>
            {currentStage === formStages.choosePayment &&
                <div className='d-flex flex-column flex-md-row gap-4 ps-5'>
                    <div className='flex-grow-1'>
                        <ChoosePaymentStage nextStage={confirmPurchase} />
                    </div>
                    <PurchaseSumary cartItems={cart} />
                </div>
                || currentStage === formStages.purchasing &&
                <div className='w-50 p-5 bg-body rounded mx-auto d-flex justify-content-center flex-column gap-4 text-center my-4'>
                    <div className="spinner-border text-primary mx-auto" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h4>Procesando tus datos...</h4>
                </div>
                || currentStage === formStages.purchased &&
                <div className='w-50 p-5 bg-body rounded mx-auto d-flex justify-content-center flex-column gap-4 text-center my-4'>
                    <img src={checklist} className='ml-blue-filter w-50 mx-auto' />
                    <h3>¡Listo! Tu compra se realizó con exito.</h3>
                </div>
                || currentStage === formStages.error &&
                <div className="my-3">
                    <UpsForm error={error} nextStage={retry} />
                </div>
            }
        </div>
    );
}