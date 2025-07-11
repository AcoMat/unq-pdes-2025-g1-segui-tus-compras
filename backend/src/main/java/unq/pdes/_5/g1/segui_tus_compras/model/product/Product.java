package unq.pdes._5.g1.segui_tus_compras.model.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.meli_api.ExternalProductDto;
import unq.pdes._5.g1.segui_tus_compras.model.user.User;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Product {
    @Id
    String id;
    @NotBlank
    String name;
    Double price;
    @Column(columnDefinition = "TEXT")
    String description;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_pictures", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "url")
    List<String> pictures = new ArrayList<>();
    Integer priceDiscountPercentage;
    Boolean isFreeShipping;

    @ElementCollection
    @CollectionTable(name = "product_attributes", joinColumns = @JoinColumn(name = "product_id"))
    private List<ProductAttribute> attributes = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Question> questions = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Review> reviews = new ArrayList<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "favorites")
    private List<User> favoritedBy = new ArrayList<>();


    public Product(ExternalProductDto apiProduct) {
        this.id = apiProduct.id;
        this.name = apiProduct.name;
        this.description = apiProduct.description != null ? apiProduct.description.content : null;
        this.attributes = apiProduct.attributes != null ? apiProduct.attributes.stream()
                .map(attribute -> new ProductAttribute(attribute.name, attribute.value))
                .toList() : null;
        this.pictures = apiProduct.pictures != null ? apiProduct.pictures.stream()
                .map(picture -> picture.url)
                .toList() : null;

        if(apiProduct.buyBoxWinner != null) {
            this.price = apiProduct.buyBoxWinner.originalPrice;

            // Calculate discount only if both price and originalPrice are not null
            if(apiProduct.buyBoxWinner.price != null && apiProduct.buyBoxWinner.originalPrice != null
                    && apiProduct.buyBoxWinner.originalPrice > 0) {
                this.priceDiscountPercentage = (int) Math.round(
                        (1 - (apiProduct.buyBoxWinner.price / apiProduct.buyBoxWinner.originalPrice)) * 100
                );
            } else {
                this.priceDiscountPercentage = null;
            }

            // Handle null shipping
            this.isFreeShipping = apiProduct.buyBoxWinner.shipping != null ?
                    apiProduct.buyBoxWinner.shipping.freeShipping : null;
        }
        this.questions = new ArrayList<>();
        this.reviews = new ArrayList<>();
    }

    public Product(String id, String name, Double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public Double getPriceWithDiscountApplied() {
        if(price == null) {
            return null;
        }
        if (priceDiscountPercentage != null && priceDiscountPercentage > 0) {
            return price - (price * priceDiscountPercentage / 100);
        }
        return price;
    }

    public void toggleFavoritedBy(User user) {
        boolean exists = this.favoritedBy.stream()
                .anyMatch(u -> u.getId().equals(user.getId()));
        if (exists) {
            this.favoritedBy.removeIf(u -> u.getId().equals(user.getId()));
        } else {
            this.favoritedBy.add(user);
        }
    }
}