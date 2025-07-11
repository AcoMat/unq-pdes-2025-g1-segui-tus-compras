import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSwitch from "../../components/basic/LoadingSwitch/LoadingSwitch";
import ErrorPage from "../ErrorPage";
import LargeBlueButton from "../../components/basic/LargeBlueButton/LargeBlueButton";
import { useEffect, useRef, useState } from "react";
import StarReview from "../../components/product/ProductReviews/StarReview";
import { postReview, userBoughtProduct } from "../../services/ApiService";
import { getToken } from "../../services/TokenService";
import useGetProduct from "../../hooks/useGetProduct";

export default function Review() {
    let navigate = useNavigate();
    const { idProduct } = useParams();
    const { product, loading } = useGetProduct(idProduct);
    const textArea = useRef(null);

    const [rating, setRating] = useState(0);

    const addReview = async () => {
        if(rating === 0) {
            alert("Por favor, selecciona una calificación.");
            return;
        }
        const token = await getToken();
        try{
            await postReview(token, idProduct, rating, textArea.current.value);
            navigate(`/product/${idProduct}`);
        } catch (error) {
            alert("Ocurrió un error al enviar la reseña. Por favor, inténtalo de nuevo más tarde.");
        }
    }

    useEffect(() => {
        getToken().then(token => {
            if (!token) {
                navigate("/login");
            }
            userBoughtProduct(token, idProduct).then((response) => {
                if (!response) {
                    navigate("/product/" + idProduct);
                }
            });
        })
    }, [idProduct]);

    return (
        <LoadingSwitch loading={loading}>
            {
                product ?
                    <div className='content-wrapper d-flex flex-column gap-3 my-3 px-4 pt-3'>
                        <div className="bg-body shadow-sm rounded d-flex flex-column gap-3 p-4 align-items-center">
                            <img src={product?.pictures[0]} className="w-25 rounded-circle border object-fit-scale p-5" alt="Product" />
                            <h3>¿Qué te pareció este producto?</h3>
                            <p>{product?.name}</p>
                            <StarReview setRating={setRating} rating={rating} />
                            <div className="d-flex justify-content-between w-25 ps-2">
                                <span className="text-muted">Malo</span>
                                <span className="text-muted">Excelente</span>
                            </div>
                        </div>
                        <div className="bg-body shadow-sm rounded d-flex flex-column gap-3 p-4 align-items-center">
                            <h4>Contanos más acerca del producto</h4>
                            <span className="text-muted">(opcional)</span>
                            <textarea rows="3" ref={textArea} placeholder="Escribí tu opinión aquí..." className="w-100"></textarea>
                        </div>
                        <span className="text-muted fs-6 mb-4">Si ya calificaste el producto se reemplazará por esta calificacion</span>
                        <div className="d-flex justify-content-between">
                            <Link to={`/product/${idProduct}`} className="text-primary text-decoration-none ps-1">Cancelar</Link>
                            <div className="w-25">
                                <LargeBlueButton onClick={addReview} text={"Enviar"} />
                            </div>
                        </div>
                    </div>
                    :
                    <ErrorPage />
            }
        </LoadingSwitch>
    );
}