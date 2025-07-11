package unq.pdes._5.g1.segui_tus_compras.service.product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unq.pdes._5.g1.segui_tus_compras.model.product.Question;
import unq.pdes._5.g1.segui_tus_compras.model.user.User;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;
import unq.pdes._5.g1.segui_tus_compras.repository.QuestionsRepository;
import unq.pdes._5.g1.segui_tus_compras.service.user.UserService;

import java.util.List;

@Service
public class QuestionsService {
    private final QuestionsRepository questionsRepository;
    private final ProductService productService;
    private final UserService userService;

    public QuestionsService(
            QuestionsRepository questionsRepository,
            ProductService productService,
            UserService userService
    ) {
        this.questionsRepository = questionsRepository;
        this.productService = productService;
        this.userService = userService;
    }

    public List<Question> getProductCommentaries(String productId) {
        return questionsRepository.findByProductId(productId);
    }

    @Transactional
    public void addCommentToProduct(String productId, String comment, Long userId) {
        User user = userService.getUserById(userId);
        Product product = productService.getProductById(productId);

        Question newQuestion = new Question(user, product, comment);
        questionsRepository.save(newQuestion);
    }
}
