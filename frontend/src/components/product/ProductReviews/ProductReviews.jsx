import StarRating from "./StarRating";
import avatarPlaceholder from '../../../assets/ui/profile-placeholder.png';

export default function ProductReviews({reviews}) {

    return (
        <div className="d-flex flex-column gap-3 px-4">
            {
                reviews &&
                reviews?.map((review) => (
                    <div key={review.id} className="d-flex flex-column gap-2 pb-3">
                        <div className="d-flex gap-2 p-1" style={{fontSize: "0.8rem"}}>
                            <div className="d-flex gap-2 align-items-center">
                                <img src={avatarPlaceholder} className="wobject-fit-cover rounded-circle me-2"
                                     width={30}/>
                                <div className="d-flex flex-column gap-1 align-items-center">
                                    <StarRating rating={review.rating}/>
                                    <span className="text-muted">{review.by}</span>
                                </div>
                            </div>
                            <span className="text-muted">
                                {review.createdAt && new Date(review.createdAt).toLocaleDateString('es-AR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                        <p>{review.comment}</p>
                    </div>
                ))
            }
        </div>
    )
}