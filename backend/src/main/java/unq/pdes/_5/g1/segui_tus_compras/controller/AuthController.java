package unq.pdes._5.g1.segui_tus_compras.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import unq.pdes._5.g1.segui_tus_compras.metrics.auth.AuthMetricsService;
import unq.pdes._5.g1.segui_tus_compras.model.dto.out.auth.AuthResponseDTO;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.auth.LoginCredentials;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.auth.RegisterData;
import unq.pdes._5.g1.segui_tus_compras.model.dto.out.user.BasicUserDto;
import unq.pdes._5.g1.segui_tus_compras.service.auth.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthMetricsService authMetricsService;

    public AuthController(AuthService authService, AuthMetricsService authMetricsService) {
        this.authService = authService;
        this.authMetricsService = authMetricsService;
    }

    @PostMapping("/register")
    public ResponseEntity<BasicUserDto> register(@Valid @RequestBody RegisterData data) {
        AuthResponseDTO newUser = authService.register(data);
        authMetricsService.incrementUserRegistration();
        return ResponseEntity.ok().header("Authorization", "Bearer " + newUser.token()).body(newUser.user());
    }

    @PostMapping("/login")
    public ResponseEntity<BasicUserDto> login(@Valid @RequestBody LoginCredentials credentials) {
        AuthResponseDTO loggedUser = authService.login(credentials);
        authMetricsService.incrementUserLogin();
        return ResponseEntity.ok().header("Authorization", "Bearer " + loggedUser.token()).body(loggedUser.user());
    }
}