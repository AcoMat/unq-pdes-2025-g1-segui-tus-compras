import { useNavigate, useParams } from 'react-router-dom';
import ProductImages from "../../components/product/ProductImages/ProductImages";
import LoadingSwitch from '../../components/basic/LoadingSwitch/LoadingSwitch';
import ProductBuy from '../../components/product/ProductBuy/ProductBuy';
import InfoSectionV2 from '../../components/layout/InfoSection/InfoSectionV2';
import ProductDescription from '../../components/product/ProductDescription/ProductDescription';
import ProductCharacteristics from '../../components/product/ProductCharacteristics/ProductCharacteristics';
import { useEffect } from 'react';
import { postComment } from '../../services/ApiService';
import ProductQuestionsAndResponses from '../../components/product/ProductQuestionsAndResponses/ProductQuestionsAndResponses';
import QuestionForm from '../../components/forms/QuestionForm/QuestionForm';
import ErrorPage from '../ErrorPage';
import ProductRating from '../../components/product/ProductReviews/ProductRating';
import ProductReviews from '../../components/product/ProductReviews/ProductReviews';
import { getToken } from '../../services/TokenService';
import useGetProduct from '../../hooks/useGetProduct';
import { useUserContext } from '../../context/UserContext';


export default function Product() {
    const navigate = useNavigate();
    const { idProduct } = useParams();
    const { user } = useUserContext();
    const { product, loading, refresh } = useGetProduct(idProduct);

    const addComment = async (text) => {
        if(!user) {
            navigate('/login', { state: { from: `/product/${idProduct}` } });
            return;
        }
        const token = await getToken();
        await postComment(token, idProduct, text);
        refresh();
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <LoadingSwitch loading={loading}>
            {
                product ?
                    <div className='content-wrapper d-flex flex-column my-3 bg-body rounded shadow-sm px-4 py-3'>
                        <div id='firsPart' className='d-flex flex-column flex-md-row gap-3 flex-grow-1 align-items-stretch mb-5' style={{ minHeight: 0 }}>
                            <ProductImages images={product?.pictures} />
                            <ProductBuy product={product} />
                        </div>
                        <InfoSectionV2 title="Características del producto">
                            <ProductCharacteristics characteristics={product?.attributes} />
                        </InfoSectionV2>

                        <InfoSectionV2 title="Descripción">
                            <ProductDescription description={product?.description} />
                        </InfoSectionV2>

                        <InfoSectionV2 title="Preguntas">
                            <QuestionForm
                                addQuestion={addComment}
                            />
                            <ProductQuestionsAndResponses
                                questions={product?.commentaries}
                            />
                        </InfoSectionV2>
                        <InfoSectionV2 title="Opiniones del producto">
                            {
                                product.reviews && product.reviews.length > 0 ?
                                    <div className='d-flex gap-5 mx-3'>
                                        <ProductRating reviews={product.reviews} />
                                        <ProductReviews reviews={product.reviews} />
                                    </div>
                                    :
                                    <p className='text-muted text-center py-4'>No hay opiniones disponibles para este producto.</p>
                            }
                        </InfoSectionV2>
                    </div>
                    :
                    <ErrorPage />
            }
        </LoadingSwitch>
    );
}