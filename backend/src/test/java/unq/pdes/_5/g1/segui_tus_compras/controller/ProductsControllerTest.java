package unq.pdes._5.g1.segui_tus_compras.controller;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.transaction.annotation.Transactional;
import unq.pdes._5.g1.segui_tus_compras.exception.product.ProductNotFoundException;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.meli_api.ApiSearchDto;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.meli_api.ExternalProductDto;
import unq.pdes._5.g1.segui_tus_compras.model.product.Question;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;
import unq.pdes._5.g1.segui_tus_compras.model.product.Review;
import unq.pdes._5.g1.segui_tus_compras.model.purchase.Purchase;
import unq.pdes._5.g1.segui_tus_compras.model.purchase.PurchaseItem;
import unq.pdes._5.g1.segui_tus_compras.model.user.User;
import unq.pdes._5.g1.segui_tus_compras.repository.*;
import unq.pdes._5.g1.segui_tus_compras.security.JwtTokenProvider;
import unq.pdes._5.g1.segui_tus_compras.service.external.MeLiApiService;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.*;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ProductsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private ProductsRepository productsRepository;
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private PurchaseRepository purchaseRepository;
    @Autowired
    private PurchaseItemRepository purchaseItemRepository;
    @Autowired
    private QuestionsRepository questionsRepository;
    @Autowired
    private ReviewsRepository reviewsRepository;
    @MockitoBean
    private MeLiApiService meLiApiService;

    @AfterEach
    void setUp() {
        questionsRepository.deleteAll();
        reviewsRepository.deleteAll();
        purchaseItemRepository.deleteAll();
        purchaseRepository.deleteAll();
        productsRepository.deleteAll();
        usersRepository.deleteAll();
    }

    @Test
    void testGetProductById() throws Exception {
        // Create a mock ExternalProductDto
        ExternalProductDto mockExternalProductDto = new ExternalProductDto();
        mockExternalProductDto.id = "MLA123456789";
        mockExternalProductDto.name = "Test Product";
        mockExternalProductDto.description = new ExternalProductDto.ShortDescriptionDto();
        mockExternalProductDto.description.content = "This is a test product description";
        mockExternalProductDto.buyBoxWinner = new ExternalProductDto.BuyBoxWinnerDto();
        mockExternalProductDto.buyBoxWinner.originalPrice = 100.0;
        mockExternalProductDto.buyBoxWinner.shipping = new ExternalProductDto.BuyBoxWinnerDto.ShippingDto();
        mockExternalProductDto.buyBoxWinner.shipping.freeShipping = true;
        // Mock MeLiApiService to return mock product data
        when(meLiApiService.getProductById(mockExternalProductDto.id)).thenReturn(mockExternalProductDto);

        mockMvc.perform(MockMvcRequestBuilders.get("/products/" + mockExternalProductDto.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(mockExternalProductDto.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Test Product"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.description").value("This is a test product description"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.price").value(100.0))
                .andExpect(MockMvcResultMatchers.jsonPath("$.isFreeShipping").value(true));
    }

    @Test
    void testGetNonExistentProductById() throws Exception {
        String NON_EXISTENT_PRODUCT_ID = "MLA999999999";
        // Mock MeLiApiService to throw ProductNotFoundException when the product is not found
        when(meLiApiService.getProductById(NON_EXISTENT_PRODUCT_ID)).thenThrow(new ProductNotFoundException(NON_EXISTENT_PRODUCT_ID));

        mockMvc.perform(MockMvcRequestBuilders.get("/products/" + NON_EXISTENT_PRODUCT_ID)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    void testGetQuestionsFromProduct() throws Exception {
        Product product = new Product("MLA123456789", "Test Product", 100.0);
        productsRepository.save(product);
        User user = new User("John","Doe","john@email.com","securePass");
        usersRepository.save(user);
        Question question = new Question(user, product, "Great product!");
        questionsRepository.save(question);

        mockMvc.perform(MockMvcRequestBuilders.get("/products/" + product.getId() + "/comments")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].comment").value("Great product!"));
    }

    @Test
    void testPostQuestionToProduct() throws Exception {
        Product product = new Product("MLA123456789", "Test Product", 100.0);
        productsRepository.save(product);

        String userToken = "testUserToken";
        User user = new User("John","Doe","john@email.com","securePass");
        usersRepository.save(user);

        when(jwtTokenProvider.validateTokenAndGetUserId(userToken)).thenReturn(user.getId());

        String testQuestion = "This is a test question";
        mockMvc.perform(MockMvcRequestBuilders.post("/products/" + product.getId() + "/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", userToken)
                        .content("{\"comment\":\"" + testQuestion + "\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("Comment added successfully"));
    }

    @Test
    void testGetReviewsFromProduct() throws Exception {
        Product product = new Product("MLA123456789", "Test Product", 100.0);
        productsRepository.save(product);
        User user = new User("John","Doe","john@email.com","securePass");
        usersRepository.save(user);
        reviewsRepository.save(new Review(product, user, 5, "Excellent quality!"));

        mockMvc.perform(MockMvcRequestBuilders.get("/products/" + product.getId() + "/reviews")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].comment").value("Excellent quality!"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].rating").value(5));
    }

    @Test
    void testPostReviewToProduct() throws Exception {
        Product product = new Product("MLA123456789", "Test Product", 100.0);
        productsRepository.save(product);

        String userToken = "testUserToken";
        User user = new User("John","Doe","john@email.com","securePass");
        usersRepository.save(user);

        PurchaseItem purchaseItem = new PurchaseItem(product, 1);
        List<PurchaseItem> purchaseItems = List.of(purchaseItem);
        Purchase purchase = new Purchase(user, purchaseItems);
        purchaseRepository.save(purchase);

        when(jwtTokenProvider.validateTokenAndGetUserId(userToken)).thenReturn(user.getId());

        mockMvc.perform(MockMvcRequestBuilders.post("/products/" + product.getId() + "/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", userToken)
                        .content("{\"review\": \"test\", \"rating\": 5}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("Review added successfully"));
    }

    @Test
    void testPostMultipleReviewsToProduct() throws Exception {
        Product product = new Product("MLA123456789", "Test Product", 100.0);
        productsRepository.save(product);

        String userToken = "testUserToken";
        User user = new User("John", "Doe", "john@email.com", "securePass");
        usersRepository.save(user);

        PurchaseItem purchaseItem = new PurchaseItem(product, 1);
        List<PurchaseItem> purchaseItems = List.of(purchaseItem);
        Purchase purchase = new Purchase(user, purchaseItems);
        purchaseRepository.save(purchase);

        when(jwtTokenProvider.validateTokenAndGetUserId(userToken)).thenReturn(user.getId());

        mockMvc.perform(MockMvcRequestBuilders.post("/products/" + product.getId() + "/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", userToken)
                        .content("{\"review\": \"test\", \"rating\": 5}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("Review added successfully"));

        mockMvc.perform(MockMvcRequestBuilders.post("/products/" + product.getId() + "/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", userToken)
                        .content("{\"review\": \"another test\", \"rating\": 4}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("Review added successfully"));

        List<Review> reviews = reviewsRepository.findByProductId(product.getId());
        assert reviews.size() == 1 : "Product should have only the last review made by the user";
    }

    @Test
    void testPostReviewToProductWithoutPurchase() throws Exception {
        Product product = new Product("MLA123456789", "Test Product", 100.0);
        productsRepository.save(product);

        String userToken = "testUserToken";
        User user = new User("John","Doe","john@email.com","securePass");
        usersRepository.save(user);

        when(jwtTokenProvider.validateTokenAndGetUserId(userToken)).thenReturn(user.getId());

        mockMvc.perform(MockMvcRequestBuilders.post("/products/" + product.getId() + "/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", userToken)
                        .content("{\"review\": \"test\", \"rating\": 5}"))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.content().string("You need to buy the product before reviewing it"));
    }

    @Test
    void testMultipleUsersReviewingSameProduct() throws Exception {
        Product product = new Product("MLA123456789", "Test Product", 100.0);
        productsRepository.save(product);

        String userToken = "testUserToken";
        User user = new User("John", "Doe", "john@email.com", "securePass");
        usersRepository.save(user);
        when(jwtTokenProvider.validateTokenAndGetUserId(userToken)).thenReturn(user.getId());

        String userToken2 = "testUserToken2";
        User user2 = new User("John", "Doe", "john2@email.com", "securePass");
        usersRepository.save(user2);
        when(jwtTokenProvider.validateTokenAndGetUserId(userToken2)).thenReturn(user2.getId());

        PurchaseItem purchaseItem1 = new PurchaseItem(product, 1);
        List<PurchaseItem> purchaseItems1 = List.of(purchaseItem1);
        Purchase purchase1 = new Purchase(user, purchaseItems1);
        purchaseRepository.save(purchase1);

        PurchaseItem purchaseItem2 = new PurchaseItem(product, 1); // NUEVO OBJETO
        List<PurchaseItem> purchaseItems2 = List.of(purchaseItem2);
        Purchase purchase2 = new Purchase(user2, purchaseItems2);
        purchaseRepository.save(purchase2);

        mockMvc.perform(MockMvcRequestBuilders.post("/products/" + product.getId() + "/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", userToken)
                        .content("{\"review\": \"review\", \"rating\": 5}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("Review added successfully"));

        mockMvc.perform(MockMvcRequestBuilders.post("/products/" + product.getId() + "/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", userToken2)
                        .content("{\"review\": \"another review from another user\", \"rating\": 4}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("Review added successfully"));

        List<Review> reviews = reviewsRepository.findByProductId(product.getId());
        assert reviews.size() == 2 : "Product should have both reviews made by different users";
    }

    @Test
    void testSearchProductsByName() throws Exception {
        String searchQuery = "Products";

        Product product1 = new Product("Product 1", "Description of Product 1", 100.0);
        productsRepository.save(product1);
        Product product2 = new Product("Product 2", "Description of Product 2", 200.0);
        productsRepository.save(product2);
        Product product3 = new Product("Product 3", "Description of Product 3", 300.0);
        productsRepository.save(product3);

        ApiSearchDto mockApiSearchDto = new ApiSearchDto();
        ApiSearchDto.SearchResultDto mockSearchResultDto1 = new ApiSearchDto.SearchResultDto();
        mockSearchResultDto1.id = product1.getId();
        ApiSearchDto.SearchResultDto mockSearchResultDto2 = new ApiSearchDto.SearchResultDto();
        mockSearchResultDto2.id = product2.getId();
        ApiSearchDto.SearchResultDto mockSearchResultDto3 = new ApiSearchDto.SearchResultDto();
        mockSearchResultDto3.id = product3.getId();
        mockApiSearchDto.results = List.of(mockSearchResultDto1, mockSearchResultDto2, mockSearchResultDto3);
        mockApiSearchDto.keywords = searchQuery;
        ApiSearchDto.PagingDto mockPagingDto = new ApiSearchDto.PagingDto();
        mockPagingDto.total = 4;
        mockPagingDto.offset = 0;
        mockPagingDto.limit = 10;
        mockApiSearchDto.paging = mockPagingDto;

        when(meLiApiService.search(searchQuery,0,10)).thenReturn(mockApiSearchDto);

        mockMvc.perform(MockMvcRequestBuilders.get("/products/search")
                        .param("q", searchQuery)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.query").value(searchQuery))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results", hasSize(3)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].id").value(product1.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[1].id").value(product2.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[2].id").value(product3.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.paging.total").value(3))
                .andExpect(MockMvcResultMatchers.jsonPath("$.paging.offset").value(0))
                .andExpect(MockMvcResultMatchers.jsonPath("$.paging.limit").value(10));
        verify(meLiApiService).search(searchQuery, 0, 10);
    }
}
