package unq.pdes._5.g1.segui_tus_compras.model.purchase;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;

@Entity
@Getter
@NoArgsConstructor
public class PurchaseItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Setter
    @ManyToOne
    @JoinColumn(name = "purchase_id")
    @JsonIgnore
    private Purchase purchase;

    private Integer amount;
    private Double subTotal;


    public PurchaseItem(Product product, Integer amount) {
        this.product = product;
        this.amount = amount;
        if(product.getPrice() != null) {
            this.subTotal = product.getPriceWithDiscountApplied() * amount;
        } else {
            this.subTotal = 0.0;
        }
    }
}
