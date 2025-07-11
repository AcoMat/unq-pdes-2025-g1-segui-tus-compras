package unq.pdes._5.g1.segui_tus_compras.service.external;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import unq.pdes._5.g1.segui_tus_compras.exception.external.ExternalApiException;
import unq.pdes._5.g1.segui_tus_compras.exception.external.InvalidApiTokenException;
import unq.pdes._5.g1.segui_tus_compras.exception.product.ProductNotFoundException;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.meli_api.ApiSearchDto;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.meli_api.ExternalProductDto;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MeLiApiServiceTest {

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private RestClient restClient;

    @Mock
    private RestClient.Builder restClientBuilder;

    @Mock
    private RestClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private RestClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private RestClient.ResponseSpec responseSpec;

    private MeLiApiService meliApiService;

    private final String apiUrl = "https://api.mercadolibre.com";
    private final String apiToken = "test-token";

    @BeforeEach
    void setUp() {
        when(restClientBuilder.baseUrl(apiUrl)).thenReturn(restClientBuilder);
        when(restClientBuilder.build()).thenReturn(restClient);
        meliApiService = new MeLiApiService(restClientBuilder, apiUrl, apiToken);

        lenient().when(restClient.get()).thenReturn(requestHeadersUriSpec);
        lenient().when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        lenient().when(requestHeadersSpec.header(anyString(), anyString())).thenReturn(requestHeadersSpec);
        lenient().when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
    }

    @Test
    void getProductById_whenProductExists_returnsProduct() {
        String productId = "MLA123";
        ExternalProductDto expectedProduct = new ExternalProductDto();
        when(responseSpec.toEntity(ExternalProductDto.class))
                .thenReturn(ResponseEntity.ok(expectedProduct));

        ExternalProductDto actualProduct = meliApiService.getProductById(productId);

        assertSame(expectedProduct, actualProduct);
    }

    @Test
    void getProductById_whenApiReturns401_throwsInvalidApiTokenException() {
        String productId = "MLA123";
        when(requestHeadersSpec.retrieve())
                .thenThrow(new HttpClientErrorException(HttpStatus.UNAUTHORIZED));

        assertThrows(InvalidApiTokenException.class, () -> meliApiService.getProductById(productId));
    }

    @Test
    void getProductById_withInvalidOrNullProductInApi_throwsNotFound() {
        String productId = "MLA123";
        when(requestHeadersSpec.retrieve())
                .thenThrow(new HttpClientErrorException(HttpStatus.NOT_FOUND));

        assertThrows(ProductNotFoundException.class, () -> meliApiService.getProductById(productId));
    }

    @Test
    void search_whenSearchIsSuccessful_returnsApiSearchDto() {
        String keywords = "test";
        ApiSearchDto expectedSearch = new ApiSearchDto();
        when(responseSpec.toEntity(ApiSearchDto.class))
                .thenReturn(ResponseEntity.ok(expectedSearch));

        ApiSearchDto actualSearch = meliApiService.search(keywords, 0, 10);

        assertSame(expectedSearch, actualSearch);
    }

    @Test
    void search_whenApiReturns401_throwsInvalidApiTokenException() {
        String keywords = "test";
        when(requestHeadersSpec.retrieve())
                .thenThrow(new HttpClientErrorException(HttpStatus.UNAUTHORIZED));

        assertThrows(InvalidApiTokenException.class, () -> meliApiService.search(keywords, 0, 10));
    }

    @Test
    void search_whenApiReturns400_throwsExternalApiException() {
        String keywords = "test";
        when(requestHeadersSpec.retrieve())
                .thenThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST));

        assertThrows(IllegalArgumentException.class, () -> meliApiService.search(keywords, 0, 10));
    }

    @Test
    void search_whenApiReturnsOtherError_throwsExternalApiException() {
        String keywords = "test";
        when(requestHeadersSpec.retrieve())
                .thenThrow(new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR));

        assertThrows(ExternalApiException.class, () -> meliApiService.search(keywords, 0, 10));
    }


    @Test
    void constructor_whenApiUrlIsNull_throwsIllegalStateException() {
        assertThrows(IllegalStateException.class, () -> new MeLiApiService(restClientBuilder, null, apiToken));
    }

    @Test
    void constructor_whenApiUrlIsEmpty_throwsIllegalStateException() {
        assertThrows(IllegalStateException.class, () -> new MeLiApiService(restClientBuilder, "", apiToken));
    }

    @Test
    void constructor_whenApiTokenIsNull_throwsIllegalStateException() {
        assertThrows(IllegalStateException.class, () -> new MeLiApiService(restClientBuilder, apiUrl, null));
    }

    @Test
    void constructor_whenApiTokenIsEmpty_throwsIllegalStateException() {
        assertThrows(IllegalStateException.class, () -> new MeLiApiService(restClientBuilder, apiUrl, ""));
    }
}
