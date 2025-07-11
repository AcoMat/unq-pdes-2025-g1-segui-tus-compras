package unq.pdes._5.g1.segui_tus_compras.model.dto.in.purchase;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PurchaseItemDto {
    @NotNull(message = "Product ID cannot be null")
    @NotEmpty(message = "Product ID cannot be empty")
    private String productId;
    @NotNull(message = "Amount cannot be null")
    @Min(value = 1, message = "Amount must be at least 1")
    private Integer amount;
}
