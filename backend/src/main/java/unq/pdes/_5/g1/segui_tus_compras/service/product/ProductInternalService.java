package unq.pdes._5.g1.segui_tus_compras.service.product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.meli_api.ExternalProductDto;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;
import unq.pdes._5.g1.segui_tus_compras.repository.ProductsRepository;
import unq.pdes._5.g1.segui_tus_compras.service.external.MeLiApiService;

@Service
public class ProductInternalService {

    private final ProductsRepository productsRepository;
    private final MeLiApiService meLiService;

    public ProductInternalService(ProductsRepository productsRepository, MeLiApiService meLiService) {
        this.productsRepository = productsRepository;
        this.meLiService = meLiService;
    }

    @Transactional()
    public Product createProductFromApi(String id) {
        // Double-check if product was created by another thread
        Product existingProduct = productsRepository.findById(id).orElse(null);
        if (existingProduct != null) {return existingProduct;}

        ExternalProductDto apiProduct = meLiService.getProductById(id);
        if (apiProduct.buyBoxWinner == null || apiProduct.buyBoxWinner.originalPrice == null) {
            apiProduct.buyBoxWinner = new ExternalProductDto.BuyBoxWinnerDto();
            // Generate random price between 50.000 and 1.000.000
            double randomPrice = 50000 + Math.random() * (1000000 - 50000);
            apiProduct.buyBoxWinner.price = Math.round(randomPrice * 100.0) / 100.0;
            // Gen Random discount percentage between 0 and 50
            int randomDiscountPercentage = (int) (Math.random() * 51);
            double originalPrice = apiProduct.buyBoxWinner.price * (1 + randomDiscountPercentage / 100.0);
            apiProduct.buyBoxWinner.originalPrice = Math.round(originalPrice * 100.0) / 100.0;
            // Generate random free shipping boolean
            apiProduct.buyBoxWinner.shipping = new ExternalProductDto.BuyBoxWinnerDto.ShippingDto();
            apiProduct.buyBoxWinner.shipping.freeShipping = Math.random() < 0.5;
        }

        return productsRepository.save(new Product(apiProduct));
    }
}
