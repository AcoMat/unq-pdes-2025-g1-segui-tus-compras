package unq.pdes._5.g1.segui_tus_compras.model.dto.in.user;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class FavoriteDto {
    @NotNull(message = "Product ID cannot be null")
    @NotEmpty(message = "Product ID cannot be empty")
    public String productId;
}
