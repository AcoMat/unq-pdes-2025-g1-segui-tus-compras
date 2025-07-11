package unq.pdes._5.g1.segui_tus_compras.model.user;

import org.junit.jupiter.api.Test;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.meli_api.ExternalProductDto;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;

public class UserModelTest {

    @Test
    public void testToggleFavorite() {
        // Create a user and a product
        User user = new User();
        ExternalProductDto extProduct = new ExternalProductDto();
        extProduct.id = "123";
        Product product = new Product(extProduct);

        // Initially, the product should not be in favorites
        assert !user.getFavorites().contains(product);

        // Toggle favorite should add the product
        user.toggleFavorite(product);
        assert user.getFavorites().contains(product);

        // Toggle favorite again should remove the product
        user.toggleFavorite(product);
        assert !user.getFavorites().contains(product);
    }
}
