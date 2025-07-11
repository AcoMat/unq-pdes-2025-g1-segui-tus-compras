package unq.pdes._5.g1.segui_tus_compras.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import unq.pdes._5.g1.segui_tus_compras.model.product.Question;

import java.util.List;

public interface QuestionsRepository extends JpaRepository<Question, Long> {
    List<Question> findByProductId(String productId);
}
