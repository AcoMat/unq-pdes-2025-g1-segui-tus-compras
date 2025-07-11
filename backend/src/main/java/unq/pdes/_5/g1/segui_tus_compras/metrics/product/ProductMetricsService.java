package unq.pdes._5.g1.segui_tus_compras.metrics.product;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ProductMetricsService {

    private final MeterRegistry meterRegistry;
    private final ConcurrentHashMap<String, Counter> productViewCounters;
    private final ConcurrentHashMap<String, Counter> productCommentCounters;
    private final ConcurrentHashMap<String, Counter> productReviewCounters;
    private final ConcurrentHashMap<String, Counter> productPurchaseCounters;
    private final ConcurrentHashMap<String, AtomicInteger> productFavoriteGauges;
    private final ConcurrentHashMap<String, Counter> productSearchCounters;

    public ProductMetricsService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.productViewCounters = new ConcurrentHashMap<>();
        this.productCommentCounters = new ConcurrentHashMap<>();
        this.productReviewCounters = new ConcurrentHashMap<>();
        this.productPurchaseCounters = new ConcurrentHashMap<>();
        this.productFavoriteGauges = new ConcurrentHashMap<>();
        this.productSearchCounters = new ConcurrentHashMap<>();
    }

    String tagKey = "product_id";

    public void incrementProductView(String productId) {
        Counter counter = productViewCounters.computeIfAbsent(productId, id ->
            Counter.builder("product_views_total")
                    .description("Total de vistas por producto")
                    .tag(tagKey, id)
                    .register(meterRegistry)
        );
        counter.increment();
    }

    public void incrementCommentByProduct(String productId) {
        Counter counter = productCommentCounters.computeIfAbsent(productId, id ->
            Counter.builder("product_comments_total")
                    .description("Total de comentarios por producto")
                    .tag(tagKey, id)
                    .register(meterRegistry)
        );
        counter.increment();
    }

    public void incrementReviewByProduct(String productId) {
        Counter counter = productReviewCounters.computeIfAbsent(productId, id ->
            Counter.builder("product_reviews_total")
                    .description("Total de reviews por producto")
                    .tag(tagKey, id)
                    .register(meterRegistry)
        );
        counter.increment();
    }


    public void incrementProductPurchase(String productId, int quantity) {
        Counter counter = productPurchaseCounters.computeIfAbsent(productId, id ->
                Counter.builder("product_purchases_total")
                        .description("Total de compras por producto")
                        .tag(tagKey, id)
                        .register(meterRegistry)
        );
        counter.increment(quantity);
    }

    public void incrementSearch(String query) {
        Counter counter = productSearchCounters.computeIfAbsent(query, q ->
                Counter.builder("product_searches_total")
                        .description("Total de busquedas de productos")
                        .tag("query", q)
                        .register(meterRegistry)
        );
        counter.increment();
    }

    public void incrementProductFavorite(String productId) {
        AtomicInteger favoriteCount = productFavoriteGauges.computeIfAbsent(productId, id -> {
            AtomicInteger count = new AtomicInteger(0);
            Gauge.builder("product_favorites_current", count, AtomicInteger::get)
                    .description("Número actual de favoritos por producto")
                    .tag(tagKey, id)
                    .register(meterRegistry);
            return count;
        });
        favoriteCount.incrementAndGet();
    }

    public void decrementProductFavorite(String productId) {
        AtomicInteger favoriteCount = productFavoriteGauges.computeIfAbsent(productId, id -> {
            AtomicInteger count = new AtomicInteger(0);
            Gauge.builder("product_favorites_current", count, AtomicInteger::get)
                    .description("Número actual de favoritos por producto")
                    .tag(tagKey, id)
                    .register(meterRegistry);
            return count;
        });
        favoriteCount.decrementAndGet();
    }

}
