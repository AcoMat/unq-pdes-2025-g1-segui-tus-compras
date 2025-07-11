package unq.pdes._5.g1.segui_tus_compras.service.user;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unq.pdes._5.g1.segui_tus_compras.exception.user.UserNotFoundException;
import unq.pdes._5.g1.segui_tus_compras.model.dto.out.user.BasicUserDto;
import unq.pdes._5.g1.segui_tus_compras.model.dto.out.user.UserDto;
import unq.pdes._5.g1.segui_tus_compras.model.product.Review;
import unq.pdes._5.g1.segui_tus_compras.model.purchase.Purchase;
import unq.pdes._5.g1.segui_tus_compras.model.user.User;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;
import unq.pdes._5.g1.segui_tus_compras.repository.UsersRepository;

import java.util.List;

@Service
public class UserService {

    private final UsersRepository usersRepository;

    public UserService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public User getUserById(Long id) {
        return usersRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    @Transactional
    public void updateUser(User user) {
        if (!usersRepository.existsById(user.getId())) {
            throw new UserNotFoundException("User not found");
        }
        usersRepository.save(user);
    }

    public List<Product> getUserFavorites(Long userId) {
        User user = getUserById(userId);
        return user.getFavorites();
    }

    public List<Purchase> getUserPurchases(Long userId) {
        User user = getUserById(userId);
        return user.getPurchases();
    }

    public List<Review> getUserReviews(Long userId) {
        User user = getUserById(userId);
        return user.getReviews();
    }

    public List<BasicUserDto> getAllUsers() {
        return usersRepository.findAll().stream().map(BasicUserDto::new).toList();
    }

    public UserDto getUserData(Long userId) {
        return usersRepository.findById(userId)
                .map(UserDto::new)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }
}
