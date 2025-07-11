package unq.pdes._5.g1.segui_tus_compras.model.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import unq.pdes._5.g1.segui_tus_compras.model.user.User;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Getter
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Min(1)
    @Max(5)
    private Integer rating;
    @Column(columnDefinition = "TEXT")
    private String comment;
    private LocalDateTime createdAt;
    @ManyToOne
    private Product product;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    public Review(Product product, User by, Integer rating, String comment) {
        this.product = product;
        this.user = by;
        this.comment = comment;
        this.rating = rating;
        this.createdAt = LocalDateTime.now();
    }

    @JsonProperty("by")
    public String by() {
        return user.getFirstName() + " " + user.getLastName();
    }
}
