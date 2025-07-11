
import creditCardImage from "../../assets/checkout/credit-card.svg";
import debitCardImage from "../../assets/checkout/debit-card.svg";
import LargeBlueButton from "../basic/LargeBlueButton/LargeBlueButton";

export default function ChoosePaymentStage({ nextStage }) {

    return (
        <>
            <h2 className="mb-5 mt-4">Eligí tu metodo de pago</h2>
            <div className="d-flex flex-column gap-3">
                <div className="bg-body d-flex gap-4 p-3 rounded fs-4 shadow-sm">
                    <input disabled className="shadow-none" type="radio" name="payment" id="debito" />
                    <img className="rounded-circle p-2 border" src={debitCardImage} />
                    <label className="pt-0 w-100" htmlFor="debito">Tarjeta de débito</label>
                </div>
                <div className="bg-body d-flex gap-4 p-3 rounded fs-4 shadow-sm">
                    <input disabled className="shadow-none" type="radio" name="payment" id="credito" />
                    <img className="rounded-circle p-2 border" src={creditCardImage} />
                    <label className="pt-0 w-100" htmlFor="credito">Tarjeta de crédito</label>
                </div>
            </div>
            <div className="my-4 d-flex justify-content-end mb-4">
                <LargeBlueButton text="Continuar" onClick={nextStage} />
            </div>
        </>
    )
}