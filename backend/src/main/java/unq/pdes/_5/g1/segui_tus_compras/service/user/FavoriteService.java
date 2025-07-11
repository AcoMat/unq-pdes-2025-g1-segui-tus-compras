package unq.pdes._5.g1.segui_tus_compras.service.user;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;
import unq.pdes._5.g1.segui_tus_compras.model.user.User;
import unq.pdes._5.g1.segui_tus_compras.service.product.ProductService;

@Service
public class FavoriteService {

    private final UserService userService;
    private final ProductService productService;

    public FavoriteService(UserService userService, ProductService productService) {
        this.userService = userService;
        this.productService = productService;
    }

    @Transactional
    public boolean toggleFavorite(Long userId, String productId) {
        User user = userService.getUserById(userId);
        Product product = productService.getProductById(productId);

        user.toggleFavorite(product);
        product.toggleFavoritedBy(user);

        userService.updateUser(user);
        return user.getFavorites().contains(product);
    }

}
