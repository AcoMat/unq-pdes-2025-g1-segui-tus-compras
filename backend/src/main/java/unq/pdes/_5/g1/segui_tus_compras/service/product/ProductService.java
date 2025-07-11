package unq.pdes._5.g1.segui_tus_compras.service.product;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unq.pdes._5.g1.segui_tus_compras.exception.product.ProductNotFoundException;
import unq.pdes._5.g1.segui_tus_compras.model.dto.out.product.ProductFavoriteCountDto;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;
import unq.pdes._5.g1.segui_tus_compras.repository.ProductsRepository;

import java.util.List;

@Service
public class ProductService {

    private final ProductsRepository productsRepository;
    private final ProductInternalService productInternalService;

    public ProductService(ProductsRepository productsRepository, ProductInternalService productInternalService) {
        this.productsRepository = productsRepository;
        this.productInternalService = productInternalService;
    }

    @Transactional()
    public Product getProductById(String id) {
        Product existingProduct = productsRepository.findById(id).orElse(null);
        if (existingProduct != null) {
            return existingProduct;
        }
        return productInternalService.createProductFromApi(id);
    }

    @Transactional
    public void updateProduct(Product product) {
        if (!productsRepository.existsById(product.getId())) {
            throw new ProductNotFoundException(product.getId());
        }
        productsRepository.save(product);
    }

    public List<ProductFavoriteCountDto> getTopFavoriteProducts() {
        return productsRepository.findTopFavoriteProducts(PageRequest.of(0, 5));
    }

}
