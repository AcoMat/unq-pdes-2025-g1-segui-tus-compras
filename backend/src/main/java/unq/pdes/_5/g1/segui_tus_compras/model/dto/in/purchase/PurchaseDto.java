package unq.pdes._5.g1.segui_tus_compras.model.dto.in.purchase;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public class PurchaseDto {
    @Valid
    @Size(min = 1, max = 100, message = "Purchase must have between 1 and 100 items")
    @NotNull(message = "You must provide at least one item")
    public List<PurchaseItemDto> items;
}
