package unq.pdes._5.g1.segui_tus_compras.model.purchase;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import unq.pdes._5.g1.segui_tus_compras.model.user.User;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime date;
    private Double total;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "purchase_id")
    private List<PurchaseItem> items;

    public Purchase(User user, List<PurchaseItem> items) {
        this.user = user;
        this.date = LocalDateTime.now();
        // Set items purchase to this purchase
        items.forEach(item -> item.setPurchase(this));
        this.items = items;
        this.total = items.stream()
                .map(PurchaseItem::getSubTotal)
                .reduce(0.0, Double::sum);
    }
}
