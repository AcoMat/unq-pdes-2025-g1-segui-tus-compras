package unq.pdes._5.g1.segui_tus_compras.model.dto.out.auth;
import unq.pdes._5.g1.segui_tus_compras.model.dto.out.user.BasicUserDto;

public record AuthResponseDTO(BasicUserDto user, String token) {
}