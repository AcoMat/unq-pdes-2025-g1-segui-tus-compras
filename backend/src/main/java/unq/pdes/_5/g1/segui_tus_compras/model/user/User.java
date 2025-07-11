package unq.pdes._5.g1.segui_tus_compras.model.user;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import unq.pdes._5.g1.segui_tus_compras.model.product.Question;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;
import unq.pdes._5.g1.segui_tus_compras.model.product.Review;
import unq.pdes._5.g1.segui_tus_compras.model.purchase.Purchase;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "app_users")
@NoArgsConstructor
@EqualsAndHashCode(of = {"id"})
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    @Column(unique = true)
    private String email;
    private String password;
    private boolean isAdmin = false;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Purchase> purchases = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "user_favorite_products",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> favorites = new ArrayList<>();


    public User(String firstName, String lastName, String email, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    public User(String firstName, String lastName, String email, String password, boolean isAdmin) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
    }

    public void toggleFavorite(Product product) {
        if (this.favorites.stream()
                .anyMatch(p -> p.getId().equals(product.getId()))) {
            this.favorites.removeIf(p -> p.getId().equals(product.getId()));
        } else {
            this.favorites.add(product);
        }
    }
}
