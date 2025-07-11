package unq.pdes._5.g1.segui_tus_compras.controller;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.meli_api.ExternalProductDto;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;
import unq.pdes._5.g1.segui_tus_compras.model.purchase.Purchase;
import unq.pdes._5.g1.segui_tus_compras.model.purchase.PurchaseItem;
import unq.pdes._5.g1.segui_tus_compras.model.user.User;
import unq.pdes._5.g1.segui_tus_compras.repository.ProductsRepository;
import unq.pdes._5.g1.segui_tus_compras.repository.PurchaseRepository;
import unq.pdes._5.g1.segui_tus_compras.repository.UsersRepository;
import unq.pdes._5.g1.segui_tus_compras.security.JwtTokenProvider;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private PurchaseRepository purchaseRepository;
    @Autowired
    private ProductsRepository productsRepository;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private String adminToken;
    private User testAdmin;

    @BeforeEach
    void setUp() {
        testAdmin = usersRepository.save(new User(
                "Test",
                "User",
                "testuser@example.com",
                "password123",
                true
        ));
        adminToken = jwtTokenProvider.generateAdminToken(testAdmin.getId());

    }

    @AfterEach
    void tearDown() {
        usersRepository.deleteAll();
    }

    @Test
    void shouldReturnOk_When_IsAdmin() throws Exception {
        mockMvc.perform(get("/admin")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void shouldReturnForbidden_When_NotAdmin() throws Exception {
        String userToken = jwtTokenProvider.generateToken(testAdmin.getId());
        mockMvc.perform(get("/admin")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnUsersList_When_IsAdmin() throws Exception {
        // Arrange
        usersRepository.save(new User("John", "Doe", "test@email.com", "encriptedPassword"));
        // Act & Assert
        mockMvc.perform(get("/admin/users")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void shouldReturnForbidden_When_NotAdmin_AccessingUsers() throws Exception {
        String userToken = jwtTokenProvider.generateToken(testAdmin.getId());
        mockMvc.perform(get("/admin/users")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnUserById_When_IsAdmin() throws Exception {
        // Arrange
        User testUser = usersRepository.save(new User("John", "Doe", "test@email.com", "encriptedPassword"));
        // Act & Assert
        mockMvc.perform(get("/admin/users/" + testUser.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUser.getId()))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.email").value("test@email.com"))
                .andExpect(jsonPath("$.isAdmin").value(false))
                .andExpect(jsonPath("$.purchases").isArray())
                .andExpect(jsonPath("$.reviews").isArray())
                .andExpect(jsonPath("$.favorites").isArray())
                .andExpect(jsonPath("$.commentaries").isArray());
    }

    @Test
    void shouldReturnForbidden_When_NotAdmin_AccessingUserById() throws Exception {
        String userToken = jwtTokenProvider.generateToken(testAdmin.getId());
        mockMvc.perform(get("/admin/users/" + testAdmin.getId())
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnTopPurchasedProducts_When_IsAdmin() throws Exception {
        // Arrange
        User testUser = usersRepository.save(new User("John", "Doe", "test@email.com", "encriptedPassword"));

        ExternalProductDto apiProduct = new ExternalProductDto();
        apiProduct.id = "EXTERNAL-123";
        apiProduct.name = "Test Product";
        Product testProduct = productsRepository.save(new Product(apiProduct));

        ExternalProductDto apiProduct2 = new ExternalProductDto();
        apiProduct2.id = "EXTERNAL-456";
        apiProduct2.name = "Another Product";
        Product anotherProduct = productsRepository.save(new Product(apiProduct2));

        ExternalProductDto apiProduct3 = new ExternalProductDto();
        apiProduct3.id = "EXTERNAL-789";
        apiProduct3.name = "Third Product";
        productsRepository.save(new Product(apiProduct3));

        purchaseRepository.save(new Purchase(testUser, List.of(new PurchaseItem(testProduct,50))));
        purchaseRepository.save(new Purchase(testUser, List.of(new PurchaseItem(anotherProduct, 30))));

        // Act & Assert
        mockMvc.perform(get("/admin/top/purchased")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].productId").value(testProduct.getId()))
                .andExpect(jsonPath("$[0].name").value(testProduct.getName()))
                .andExpect(jsonPath("$[1].productId").value(anotherProduct.getId()))
                .andExpect(jsonPath("$[1].name").value(anotherProduct.getName()));
    }



}