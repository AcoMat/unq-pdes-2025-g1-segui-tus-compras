package unq.pdes._5.g1.segui_tus_compras.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;
import unq.pdes._5.g1.segui_tus_compras.model.product.Review;
import unq.pdes._5.g1.segui_tus_compras.model.user.User;

import java.util.List;
import java.util.Optional;

public interface ReviewsRepository extends JpaRepository<Review,Long> {
    List<Review> findByProductId(String productId);
    Optional<Review> findByProductAndUser(Product product, User user);
}
