package unq.pdes._5.g1.segui_tus_compras.service.search;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.meli_api.ApiSearchDto;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;
import unq.pdes._5.g1.segui_tus_compras.service.external.MeLiApiService;
import unq.pdes._5.g1.segui_tus_compras.service.product.ProductService;

import java.util.List;
import java.util.Objects;

@Service
public class SearchService {

    private final MeLiApiService meLiService;
    private final ProductService productService;
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(SearchService.class);

    public SearchService(MeLiApiService meLiService, ProductService productService) {
        this.meLiService = meLiService;
        this.productService = productService;
    }

    @Cacheable("searchProducts")
    public List<Product> searchProducts(String keywords, int offset, int limit) {
        ApiSearchDto apiProducts = meLiService.search(keywords, offset, limit);
        if (apiProducts.results.isEmpty()) {
            return List.of();
        }
        return apiProducts.results.stream()
                .collect(java.util.stream.Collectors.toMap(
                        result -> result.id,
                        result -> result,
                        (existing, replacement) -> existing, // Keep first occurrence if duplicate IDs
                        java.util.LinkedHashMap::new // Preserve insertion order
                ))
                .values()
                .stream()
                .map(result -> {
                    try {
                        return productService.getProductById(result.id);
                    } catch (Exception e) {
                        // Log the error but continue processing other products
                        logger.error("Error processing product {}: {}", result.id, e.getMessage());
                        return null;
                    }
                })
                .filter(Objects::nonNull) // Remove null products that failed to process
                .toList();
    }
}
