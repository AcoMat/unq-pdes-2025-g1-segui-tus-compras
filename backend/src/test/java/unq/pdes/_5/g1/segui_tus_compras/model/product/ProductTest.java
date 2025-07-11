package unq.pdes._5.g1.segui_tus_compras.model.product;

import org.junit.jupiter.api.Test;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.meli_api.ExternalProductDto;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ProductTest {

    /**
     * Helper method to create a sample external product DTO for testing
     */
    private ExternalProductDto createSampleExternalProductDto() {
        // Create a test ExternalProductDto
        ExternalProductDto dto = new ExternalProductDto();
        dto.id = "EXTERNAL-123";
        dto.name = "External Product";

        // Set description
        ExternalProductDto.ShortDescriptionDto descriptionDto = new ExternalProductDto.ShortDescriptionDto();
        descriptionDto.content = "External product description";
        dto.description = descriptionDto;

        // Set attributes
        ExternalProductDto.AttributeDto attributeDto = new ExternalProductDto.AttributeDto();
        attributeDto.name = "Brand";
        attributeDto.value = "Test Brand";
        dto.attributes = List.of(attributeDto);

        // Set pictures
        ExternalProductDto.PictureDto pictureDto = new ExternalProductDto.PictureDto();
        pictureDto.url = "http://test.com/image.jpg";
        dto.pictures = List.of(pictureDto);

        // Set buy box winner
        ExternalProductDto.BuyBoxWinnerDto buyBoxWinnerDto = new ExternalProductDto.BuyBoxWinnerDto();
        buyBoxWinnerDto.price = 90.0;
        buyBoxWinnerDto.originalPrice = 100.0;

        // Set shipping info
        ExternalProductDto.BuyBoxWinnerDto.ShippingDto shippingDto = new ExternalProductDto.BuyBoxWinnerDto.ShippingDto();
        shippingDto.freeShipping = true;
        buyBoxWinnerDto.shipping = shippingDto;

        dto.buyBoxWinner = buyBoxWinnerDto;

        return dto;
    }

    /**
     * Helper method to create a Product instance with custom values using the full constructor
     */
    private Product createTestProduct(Integer discountPercentage) {
        // Since Product doesn't have setters, we need to use reflection to set values for testing
        ExternalProductDto dto = createSampleExternalProductDto();
        dto.id = "TEST-123";
        dto.buyBoxWinner.originalPrice = 100.0;
        if (discountPercentage != null) {
            dto.buyBoxWinner.price = 100.0 * (1 - discountPercentage / 100.0);
        }
        return new Product(dto);
    }

    @Test
    void emptyConstructor_ShouldInitializeEmptyCollections() {
        // Arrange & Act
        Product product = new Product();

        // Assert
        assertNotNull(product.getQuestions());
        assertTrue(product.getQuestions().isEmpty());

        assertNotNull(product.getReviews());
        assertTrue(product.getReviews().isEmpty());

        assertNotNull(product.getFavoritedBy());
        assertTrue(product.getFavoritedBy().isEmpty());
    }

    @Test
    void constructorWithExternalProductDto_ShouldMapAllPropertiesCorrectly() {
        // Arrange
        ExternalProductDto dto = createSampleExternalProductDto();

        // Act
        Product product = new Product(dto);

        // Assert
        assertEquals("EXTERNAL-123", product.getId());
        assertEquals("External Product", product.getName());
        assertEquals("External product description", product.getDescription());

        // Check attributes
        assertNotNull(product.getAttributes());
        assertEquals(1, product.getAttributes().size());
        assertEquals("Brand", product.getAttributes().getFirst().getName());
        assertEquals("Test Brand", product.getAttributes().getFirst().getValue());

        // Check pictures
        assertNotNull(product.getPictures());
        assertEquals(1, product.getPictures().size());
        assertEquals("http://test.com/image.jpg", product.getPictures().getFirst());

        // Check price and discount
        assertEquals(100.0, product.getPrice());
        assertEquals(10, product.getPriceDiscountPercentage());

        // Check free shipping
        assertTrue(product.getIsFreeShipping());

        // Check questions initialization
        assertNotNull(product.getQuestions());
        assertTrue(product.getQuestions().isEmpty());
    }

    @Test
    void constructorWithNullValues_ShouldHandleNullsGracefully() {
        // Arrange
        ExternalProductDto nullDto = new ExternalProductDto();
        nullDto.id = "NULL-123";
        nullDto.name = "Test Null";
        nullDto.description = null;
        nullDto.attributes = null;
        nullDto.pictures = null;
        nullDto.buyBoxWinner = null;

        // Act
        Product product = new Product(nullDto);

        // Assert
        assertEquals("NULL-123", product.getId());
        assertEquals("Test Null", product.getName());
        assertNull(product.getDescription());
        assertNull(product.getAttributes());
        assertNull(product.getPictures());
        assertNull(product.getPrice());
        assertNull(product.getPriceDiscountPercentage());
        assertNull(product.getIsFreeShipping());
    }

    @Test
    void getPriceWithDiscountApplied_WithDiscount_ShouldReturnDiscountedPrice() {
        // Arrange
        Product product = createTestProduct(20);

        // Act
        Double discountedPrice = product.getPriceWithDiscountApplied();

        // Assert
        assertEquals(80.0, discountedPrice);
    }

    @Test
    void getPriceWithDiscountApplied_WithZeroDiscount_ShouldReturnOriginalPrice() {
        // Arrange
        Product product = createTestProduct(0);

        // Act
        Double result = product.getPriceWithDiscountApplied();

        // Assert
        assertEquals(100.0, result);
    }

    @Test
    void getPriceWithDiscountApplied_WithNullDiscount_ShouldReturnOriginalPrice() {
        // Arrange
        ExternalProductDto dto = createSampleExternalProductDto();
        dto.buyBoxWinner.price = dto.buyBoxWinner.originalPrice; // No discount
        Product product = new Product(dto);

        // Act
        Double result = product.getPriceWithDiscountApplied();

        // Assert
        assertEquals(100.0, result);
    }

    @Test
    void getPriceWithDiscountApplied_WithNullPrice_ShouldReturnNull() {
        // Arrange
        ExternalProductDto dto = createSampleExternalProductDto();
        dto.buyBoxWinner.originalPrice = null;
        Product product = new Product(dto);

        // Act
        Double result = product.getPriceWithDiscountApplied();

        // Assert
        assertNull(result);
    }
}