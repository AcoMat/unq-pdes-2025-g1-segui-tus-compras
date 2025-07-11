package unq.pdes._5.g1.segui_tus_compras.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.user.ReviewDto;
import unq.pdes._5.g1.segui_tus_compras.model.dto.out.search.SearchDTO;
import unq.pdes._5.g1.segui_tus_compras.model.product.Question;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.user.CommentDto;
import unq.pdes._5.g1.segui_tus_compras.model.dto.out.search.PagingDto;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;
import unq.pdes._5.g1.segui_tus_compras.model.product.Review;
import unq.pdes._5.g1.segui_tus_compras.security.annotation.NeedsAuth;
import unq.pdes._5.g1.segui_tus_compras.service.product.QuestionsService;
import unq.pdes._5.g1.segui_tus_compras.service.product.ProductService;
import unq.pdes._5.g1.segui_tus_compras.service.product.ReviewService;
import unq.pdes._5.g1.segui_tus_compras.metrics.product.ProductMetricsService;
import jakarta.validation.Valid;
import unq.pdes._5.g1.segui_tus_compras.service.search.SearchService;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductsController {

    private final ProductService productService;
    private final QuestionsService questionsService;
    private final ReviewService reviewService;
    private final ProductMetricsService productMetricsService;
    private final SearchService searchService;

    public ProductsController(
            ProductService productService,
            QuestionsService questionsService,
            ReviewService reviewService,
            ProductMetricsService productMetricsService,
            SearchService searchService
    ) {
        this.productService = productService;
        this.questionsService = questionsService;
        this.reviewService = reviewService;
        this.productMetricsService = productMetricsService;
        this.searchService = searchService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        productMetricsService.incrementProductView(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/search")
    public ResponseEntity<SearchDTO> searchProductsByName(
            @RequestParam String q,
            @RequestParam(required = false, defaultValue = "0") Integer offset,
            @RequestParam(required = false, defaultValue = "10") Integer limit
    ) {
        List<Product> productsSearch = searchService.searchProducts(q, offset, limit);
        PagingDto paging = new PagingDto(offset, limit, productsSearch.size());
        productMetricsService.incrementSearch(q);
        return ResponseEntity.ok(new SearchDTO(paging, q, productsSearch));
    }

    @GetMapping("/{productId}/comments")
    public ResponseEntity<List<Question>> getCommentsFromProduct(@PathVariable String productId) {
        return ResponseEntity.ok(questionsService.getProductCommentaries(productId));
    }

    @NeedsAuth
    @PostMapping("/{productId}/comments")
    public ResponseEntity<String> addCommentToProduct(
            @PathVariable String productId,
            @Valid @RequestBody CommentDto commentDto,
            HttpServletRequest request
    ) {
        Long userId = (Long) request.getAttribute("userId");
        questionsService.addCommentToProduct(productId, commentDto.comment, userId);
        productMetricsService.incrementCommentByProduct(productId);
        return ResponseEntity.ok("Comment added successfully");
    }

    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<Review>> getReviewsFromProduct(@PathVariable String productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @NeedsAuth
    @PostMapping("/{productId}/reviews")
    public ResponseEntity<String> postReviewToProduct(
            @PathVariable String productId,
            @Valid @RequestBody ReviewDto reviewDto,
            HttpServletRequest request
    ) {
        Long userId = (Long) request.getAttribute("userId");
        reviewService.addReviewToProduct(productId, reviewDto.rating, reviewDto.review, userId);
        productMetricsService.incrementReviewByProduct(productId);
        return ResponseEntity.ok("Review added successfully");
    }
}
