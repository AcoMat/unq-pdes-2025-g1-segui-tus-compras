package unq.pdes._5.g1.segui_tus_compras.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import unq.pdes._5.g1.segui_tus_compras.model.purchase.Purchase;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase,Long> {
    @Query("SELECT COUNT(p) > 0 FROM Purchase p " +
            "JOIN p.items i " +
            "WHERE p.user.id = :userId AND i.product.id = :productId")
    boolean hasUserBoughtProduct(@Param("userId") Long userId, @Param("productId") String productId);

    @Query("SELECT p.user, COUNT(p) " +
            "FROM Purchase p " +
            "GROUP BY p.user " +
            "ORDER BY COUNT(p) DESC")
    List<Object[]> findTopUsers(Pageable pageable);
}
