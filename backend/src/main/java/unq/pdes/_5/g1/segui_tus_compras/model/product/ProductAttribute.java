package unq.pdes._5.g1.segui_tus_compras.model.product;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductAttribute {
    @NotNull
    @NotEmpty
    private String name;
    @NotNull
    @NotEmpty
    @Column(name = "attribute_value")
    private String value;
}