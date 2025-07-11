package unq.pdes._5.g1.segui_tus_compras.model.dto.in.purchase;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class PurchaseDtoTest {

    private static Validator validator;

    @BeforeAll
    public static void setUp() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void testPurchaseDto_withNullItems_shouldFailValidation() {
        PurchaseDto dto = new PurchaseDto();
        dto.items = null;

        Set<ConstraintViolation<PurchaseDto>> violations = validator.validate(dto);
        assertEquals(1, violations.size());
        assertEquals("You must provide at least one item", violations.iterator().next().getMessage());
    }

    @Test
    void testPurchaseDto_withEmptyItems_shouldFailValidation() {
        PurchaseDto dto = new PurchaseDto();
        dto.items = new ArrayList<>();

        Set<ConstraintViolation<PurchaseDto>> violations = validator.validate(dto);
        assertEquals(1, violations.size());
        assertEquals("Purchase must have between 1 and 100 items", violations.iterator().next().getMessage());
    }

    @Test
    void testPurchaseDto_withTooManyItems_shouldFailValidation() {
        PurchaseDto dto = new PurchaseDto();
        List<PurchaseItemDto> items = new ArrayList<>();
        IntStream.range(0, 101).forEach(i -> items.add(new PurchaseItemDto("product" + i, 1)));
        dto.items = items;

        Set<ConstraintViolation<PurchaseDto>> violations = validator.validate(dto);
        assertEquals(1, violations.size());
        assertEquals("Purchase must have between 1 and 100 items", violations.iterator().next().getMessage());
    }

    @Test
    void testPurchaseDto_withValidItems_shouldPassValidation() {
        PurchaseDto dto = new PurchaseDto();
        PurchaseItemDto item = new PurchaseItemDto("123",1);
        dto.items = Collections.singletonList(item);

        Set<ConstraintViolation<PurchaseDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }
}
