package unq.pdes._5.g1.segui_tus_compras.service.auth;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unq.pdes._5.g1.segui_tus_compras.exception.auth.AlreadyExistingUserException;
import unq.pdes._5.g1.segui_tus_compras.exception.auth.WrongCredentialsException;
import unq.pdes._5.g1.segui_tus_compras.model.dto.out.user.BasicUserDto;
import unq.pdes._5.g1.segui_tus_compras.model.user.User;
import unq.pdes._5.g1.segui_tus_compras.model.dto.out.auth.AuthResponseDTO;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.auth.LoginCredentials;
import unq.pdes._5.g1.segui_tus_compras.model.dto.in.auth.RegisterData;
import unq.pdes._5.g1.segui_tus_compras.repository.UsersRepository;
import unq.pdes._5.g1.segui_tus_compras.security.JwtTokenProvider;

@Service
public class AuthService {

    private final UsersRepository usersRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UsersRepository usersRepository, JwtTokenProvider jwtTokenProvider, BCryptPasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponseDTO register(RegisterData registerData) {

        if (usersRepository.existsByEmail(registerData.getEmail())) {
            throw new AlreadyExistingUserException("An user with this email already exists");
        }

        User new_user = usersRepository.save(
                new User(
                        registerData.getFirstName(),
                        registerData.getLastName(),
                        registerData.getEmail(),
                        passwordEncoder.encode(registerData.getPassword())
                )
        );

        return new AuthResponseDTO(new BasicUserDto(new_user), jwtTokenProvider.generateToken(new_user.getId()));
    }

    @Transactional
    public AuthResponseDTO login(LoginCredentials credentials){
        User user = usersRepository.findByEmail(credentials.email);
        if (user == null || !passwordEncoder.matches(credentials.password, user.getPassword())) {
            throw new WrongCredentialsException("Email or password is incorrect");
        }
        String token;
        if(user.isAdmin()){
            token = jwtTokenProvider.generateAdminToken(user.getId());
        } else {
            token = jwtTokenProvider.generateToken(user.getId());
        }
        return new AuthResponseDTO(new BasicUserDto(user), token);

    }
}
