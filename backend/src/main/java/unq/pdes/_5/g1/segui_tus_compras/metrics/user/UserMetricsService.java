package unq.pdes._5.g1.segui_tus_compras.metrics.user;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class UserMetricsService {

    private final MeterRegistry meterRegistry;
    private final ConcurrentHashMap<String, Counter> userPurchaseCounters;
    private final ConcurrentHashMap<String, AtomicInteger> userFavoriteGauges;

    String tagKey = "user_id";

    public UserMetricsService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.userPurchaseCounters = new ConcurrentHashMap<>();
        this.userFavoriteGauges = new ConcurrentHashMap<>();
    }

    public void incrementUserPurchase(Long userId) {
        Counter counter = userPurchaseCounters.computeIfAbsent(String.valueOf(userId), id ->
            Counter.builder("user_purchases_total")
                    .description("Total de compras por usuario")
                    .tag(tagKey, id)
                    .register(meterRegistry)
        );
        counter.increment();
    }

    public void incrementUserFavorite(Long userId) {
        AtomicInteger favoriteCount = userFavoriteGauges.computeIfAbsent(String.valueOf(userId), id -> {
            AtomicInteger count = new AtomicInteger(0);
            Gauge.builder("user_favorites_current", count, AtomicInteger::get)
                    .description("Número actual de favoritos por usuario")
                    .tag(tagKey, id)
                    .register(meterRegistry);
            return count;
        });
        favoriteCount.incrementAndGet();
    }

    public void decrementUserFavorite(Long userId) {
        AtomicInteger favoriteCount = userFavoriteGauges.computeIfAbsent(String.valueOf(userId), id -> {
            AtomicInteger count = new AtomicInteger(0);
            Gauge.builder("user_favorites_current", count, AtomicInteger::get)
                    .description("Número actual de favoritos por usuario")
                    .tag(tagKey, id)
                    .register(meterRegistry);
            return count;
        });
        favoriteCount.decrementAndGet();
    }

}
