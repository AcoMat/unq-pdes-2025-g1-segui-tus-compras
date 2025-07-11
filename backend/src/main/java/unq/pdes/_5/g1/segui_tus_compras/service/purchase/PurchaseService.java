package unq.pdes._5.g1.segui_tus_compras.service.purchase;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.purchase.PurchaseItemDto;
import unq.pdes._5.g1.segui_tus_compras.model.dto.out.product.TopPurchasedProductDto;
import unq.pdes._5.g1.segui_tus_compras.model.dto.out.user.UserPurchasesDto;
import unq.pdes._5.g1.segui_tus_compras.model.product.Product;
import unq.pdes._5.g1.segui_tus_compras.model.purchase.Purchase;
import unq.pdes._5.g1.segui_tus_compras.model.purchase.PurchaseItem;
import unq.pdes._5.g1.segui_tus_compras.model.user.User;
import unq.pdes._5.g1.segui_tus_compras.repository.PurchaseItemRepository;
import unq.pdes._5.g1.segui_tus_compras.repository.PurchaseRepository;
import unq.pdes._5.g1.segui_tus_compras.service.product.ProductService;
import unq.pdes._5.g1.segui_tus_compras.service.user.UserService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PurchaseService {

    private final ProductService productService;
    private final UserService userService;
    private final PurchaseRepository purchaseRepository;
    private final PurchaseItemRepository purchaseItemRepository;

    public PurchaseService(
            ProductService productService,
            UserService userService,
            PurchaseRepository purchaseRepository,
            PurchaseItemRepository purchaseItemRepository
    ) {
        this.productService = productService;
        this.userService = userService;
        this.purchaseItemRepository = purchaseItemRepository;
        this.purchaseRepository = purchaseRepository;
    }

    @Transactional
    public void generatePurchase(Long userId, List<PurchaseItemDto> dtoItems) {
        User user = userService.getUserById(userId);
        List<PurchaseItem> items = dtoItems
                .stream().map(p -> new PurchaseItem(
                                productService.getProductById(p.getProductId()),
                                p.getAmount()
                        )
                ).collect(Collectors.toList());
        Purchase purchase = new Purchase(user, items);
        purchaseRepository.save(purchase);
    }

    public boolean userBoughtProduct(Long userId, String productId) {
        return purchaseRepository.hasUserBoughtProduct(userId, productId);
    }

    public List<TopPurchasedProductDto> getTopPurchasedProducts() {
        List<Object[]> rawResults = purchaseItemRepository.findTopProductsRaw(PageRequest.of(0, 5));
        return rawResults.stream()
                .map(row -> new TopPurchasedProductDto((Product) row[0], (Long) row[1]))
                .collect(Collectors.toList());
    }

    public List<UserPurchasesDto> getTopBuyers() {
        List<Object[]> result = purchaseRepository.findTopUsers(PageRequest.of(0, 5));
        return result.stream()
                .map(row -> new UserPurchasesDto((User) row[0], (Long) row[1]))
                .collect(Collectors.toList());
    }
}
