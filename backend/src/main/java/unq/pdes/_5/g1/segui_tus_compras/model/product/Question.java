package unq.pdes._5.g1.segui_tus_compras.model.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unq.pdes._5.g1.segui_tus_compras.model.user.User;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String comment;
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;


    public Question(User by, Product product, String comment) {
        this.user = by;
        this.product = product;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    @JsonProperty("by")
    public String getUserName() {
        return this.user.getFirstName();
    }
}
