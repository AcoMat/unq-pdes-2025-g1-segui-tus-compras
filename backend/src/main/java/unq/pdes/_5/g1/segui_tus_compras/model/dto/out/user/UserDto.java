package unq.pdes._5.g1.segui_tus_compras.model.dto.out.user;

import unq.pdes._5.g1.segui_tus_compras.model.product.Question;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;
import unq.pdes._5.g1.segui_tus_compras.model.product.Review;
import unq.pdes._5.g1.segui_tus_compras.model.purchase.Purchase;
import unq.pdes._5.g1.segui_tus_compras.model.user.User;

import java.util.List;

public class UserDto {
    public Long id;
    public String firstName;
    public String lastName;
    public String email;
    public boolean isAdmin = false;
    public List<Purchase> purchases;
    public List<Review> reviews;
    public List<Product> favorites;
    public List<Question> commentaries;

    public UserDto(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.purchases = user.getPurchases();
        this.reviews = user.getReviews();
        this.favorites = user.getFavorites();
        this.commentaries = user.getQuestions();
        this.isAdmin = user.isAdmin();
    }
}
