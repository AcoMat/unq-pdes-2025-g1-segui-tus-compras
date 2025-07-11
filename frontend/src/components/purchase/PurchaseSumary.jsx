import { formatARS } from '../../util/priceUtil';
import './PurchaseSumary.css';

function PurchaseSumary({ cartItems }) {
    const totalProducts = cartItems?.reduce(
        (total, item) => total + (item.amount ?? 0),
        0
    );
    const totalShippings = cartItems?.reduce(
        (total, item) => total + (item.product?.isFreeShipping ? 0 : 1),
        0
    );
    const totalProductsPrice = cartItems?.reduce(
        (total, item) => total + ((item.amount ?? 0) * (item.product?.price ?? 0)),
        0
    );
    const totalShippingsPrice = cartItems?.reduce(
        (total, item) => total + (item.product?.shipping?.price ?? 0),
        0
    );

    return (
        <div className='purchase-summary d-flex flex-column rounded sticky-top' style={{ padding: "4rem" }}>
            <h3 className='fs-5 pb-4 border-bottom'>Resumen de compra</h3>
            <div className='d-flex justify-content-between'>
                <p>Productos ({totalProducts})</p>
                <p>{formatARS(totalProductsPrice)}</p>
            </div>
            <div className='d-flex justify-content-between'>
                <p>Envios ({totalShippings})</p>
                <p>{formatARS(totalShippingsPrice)}</p>
            </div>
            <div className='d-flex justify-content-between border-top'>
                <p className="fs-5 fw-semibold">Total</p>
                <p className="fs-5 fw-semibold">{formatARS(totalProductsPrice + totalShippingsPrice)}</p>
            </div>
        </div>
    );
}

export default PurchaseSumary;
