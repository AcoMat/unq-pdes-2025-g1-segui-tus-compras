import starIcon from '../../../assets/ui/star.svg'
import starFilledIcon from '../../../assets/ui/star-fill.svg'
import './LikeStarSwitch.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserContext } from '../../../context/UserContext';
import { useFavoritesContext } from '../../../context/FavoritesContext';

function LikeStarSwitch({ productId }) {
    const navigate = useNavigate();
    const { user } = useUserContext();    
    const { favorites, toggleFavoriteProduct } = useFavoritesContext();
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        favorites?.find(likedProduct => likedProduct.id === productId) ? setLiked(true) : setLiked(false)
    }, [favorites, liked])

    const handleLike = (e) => {
        e.stopPropagation()
        if (user) {
            setLiked(!liked);
            toggleFavoriteProduct(productId);
        } else {
            navigate('/login')
        }
    }

    return (
        <div
            className={`like-button bg-body border rounded-circle position-absolute top-0 end-0 lh-1 text-center p-2 m-2 ${liked ? "liked" : "not-liked"}`}
            onClick={handleLike}
        >
            <img
                src={liked ? starFilledIcon : starIcon}
                className=''
                width={20}
                height={20}
            />
        </div>
    );
}

export default LikeStarSwitch;
