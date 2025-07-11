package unq.pdes._5.g1.segui_tus_compras.model.dto.in.purchase;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class PurchaseItemDtoTest {

    private static Validator validator;

    @BeforeAll
    public static void setUp() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void testPurchaseItemDto_withNullProductId_shouldFailValidation() {
        PurchaseItemDto dto = new PurchaseItemDto("", 1);

        Set<ConstraintViolation<PurchaseItemDto>> violations = validator.validate(dto);
        assertEquals(1, violations.size());
        assertEquals("Product ID cannot be empty", violations.iterator().next().getMessage());
    }

    @Test
    void testPurchaseItemDto_withZeroAmount_shouldFailValidation() {
        PurchaseItemDto dto = new PurchaseItemDto("123", 0);

        Set<ConstraintViolation<PurchaseItemDto>> violations = validator.validate(dto);
        assertEquals(1, violations.size());
        assertEquals("Amount must be at least 1", violations.iterator().next().getMessage());
    }

    @Test
    void testPurchaseItemDto_withNegativeAmount_shouldFailValidation() {
        PurchaseItemDto dto = new PurchaseItemDto("123", -1);

        Set<ConstraintViolation<PurchaseItemDto>> violations = validator.validate(dto);
        assertEquals(1, violations.size());
        assertEquals("Amount must be at least 1", violations.iterator().next().getMessage());
    }

    @Test
    void testPurchaseItemDto_withValidData_shouldPassValidation() {
        PurchaseItemDto dto = new PurchaseItemDto("123", 1);

        Set<ConstraintViolation<PurchaseItemDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }
}
