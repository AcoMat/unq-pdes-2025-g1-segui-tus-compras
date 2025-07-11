import LoadingSwitch from "../../components/basic/LoadingSwitch/LoadingSwitch";
import profileImagePlaceholder from "../../assets/ui/profile-placeholder.png";
import { Link, useNavigate, useParams } from 'react-router-dom';
import PurchaseHistory from "../../components/user/Purchases/PurchaseHistory";
import FavoriteProductItemCard from "../../components/cards/FavoriteProductItemCard/FavoriteProductItemCard";
import InfoSectionV2 from "../../components/layout/InfoSection/InfoSectionV2";
import StarRating from "../../components/product/ProductReviews/StarRating";
import { useAdminGetUserData } from "../../hooks/admin/useAdminGetUserData";
import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";

function UserProfileAdmin() {
    const navigate = useNavigate();
    const { idUser } = useParams();
    const { userData, loading } = useAdminGetUserData(idUser);
    const { user } = useUserContext();

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate("/");
        }
    }, [user]);

    return (
        <LoadingSwitch loading={loading}>

            <div className='content-wrapper'>
                <div className='w-75 px-md-5 mx-auto my-5 d-flex flex-column gap-4 bg-body rounded shadow-sm'>
                    <div className='bg-body d-flex p-4 rounded shadow-sm'>
                        <img className="rounded-circle object-fit-cover" src={profileImagePlaceholder} alt="User" width={80} height={80} />
                        <div className='d-flex flex-column mx-4 pt-2'>
                            <span className='fs-5 fw-medium'>{userData?.firstName + ' ' + userData?.lastName}</span>
                            <p>{userData?.email}</p>
                        </div>
                    </div>
                    <InfoSectionV2 title={"Ultimas compras del usuario"}>

                        <div className="d-flex flex-column">
                            {
                                userData.purchases && userData.purchases?.length > 0 ?
                                    userData.purchases.slice().reverse().map((purchase) => {
                                        return (
                                            <PurchaseHistory key={purchase.date.toString()} purchase={purchase} />
                                        )
                                    })
                                    :
                                    <div className="d-flex flex-column text-center justify-content-center bg-body" style={{ height: "250px" }}>
                                        <h5>El usuario todavia no compró ningun producto</h5>
                                    </div>
                            }
                        </div>
                    </InfoSectionV2>
                    <InfoSectionV2 title={"Productos favoritos del usuario"}>
                        <div className="bg-body p-3 d-flex flex-column">
                            {userData.favorites && userData.favorites.length > 0 ?
                                userData.favorites.map((product) => {
                                    return (
                                        <FavoriteProductItemCard key={product.id} product={product} />
                                    )
                                })
                                :
                                <div className="d-flex flex-column text-center justify-content-center" style={{ height: "250px" }}>
                                    <h5>El usuario aun no tiene productos favoritos</h5>
                                </div>
                            }
                        </div>
                    </InfoSectionV2>
                    <InfoSectionV2 title={"Ultimos comentarios del usuario"}>
                        {userData.commentaries && userData.commentaries?.length > 0 ?
                            userData.commentaries.map((commentary) => (
                                <div className="d-flex align-items-center my-3" key={commentary?.id}>
                                    <Link to={`/product/${commentary.product.id}`}>
                                    <img className="rounded-circle object-fit-contain" src={commentary.product.pictures[0]} width={50} height={50} />
                                    </Link>
                                    <div className={`mx-4`} key={commentary?.id}>
                                        <p className={`mb-0 my-3`} index={commentary?.id}>{commentary?.comment}</p>
                                    </div>
                                </div>

                            ))
                            :
                            <p className="text-center text-secondary py-5">El usuario no realizó ningun comentario</p>
                        }
                    </InfoSectionV2>
                    <InfoSectionV2 title={"Ultimas opiniones del usuario"}>
                        {
                            userData.reviews && userData.reviews.length > 0 ?
                                <div className='d-flex gap-3'>
                                    <div className="d-flex flex-column gap-3 px-4">
                                        {
                                            userData.reviews &&
                                            userData.reviews.map((review) => (
                                                <div key={review.id} className="d-flex gap-3">
                                                    <Link to={`/product/${review.product.id}`} >
                                                    <img className="rounded-circle object-fit-contain" src={review.product.pictures[0]} width={50} height={50} />
                                                    </Link>
                                                    <div className="d-flex flex-column">
                                                        <div className="mb-3" style={{ fontSize: "0.8rem" }}>
                                                            <StarRating rating={review.rating} />
                                                            <span className="text-muted">
                                                                {review.createdAt && new Date(review.createdAt).toLocaleDateString('es-AR', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <p className="">{review.comment}</p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                :
                                <p className='text-muted text-center py-4'>El usuario no realizó ninguna opinion</p>
                        }
                    </InfoSectionV2>
                </div>
            </div>
        </LoadingSwitch>
    );
}

export default UserProfileAdmin;