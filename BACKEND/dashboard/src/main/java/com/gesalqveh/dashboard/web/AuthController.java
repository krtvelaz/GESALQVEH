package com.gesalqveh.dashboard.web;

import com.gesalqveh.dashboard.security.AuthProperties;
import com.gesalqveh.dashboard.security.SessionStore;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final SessionStore sessionStore;
    private final AuthProperties auth;

    public AuthController(SessionStore sessionStore, AuthProperties auth) {
        this.sessionStore = sessionStore;
        this.auth = auth;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletResponse response) {
        if (!auth.username().equals(req.username()) || !auth.password().equals(req.password())) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }
        String token = sessionStore.create(req.username());
        Cookie cookie = new Cookie(SessionStore.COOKIE_NAME, token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 8);
        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of("username", req.username()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if (SessionStore.COOKIE_NAME.equals(c.getName())) {
                    sessionStore.invalidate(c.getValue());
                }
            }
        }
        Cookie clear = new Cookie(SessionStore.COOKIE_NAME, "");
        clear.setHttpOnly(true);
        clear.setPath("/");
        clear.setMaxAge(0);
        response.addCookie(clear);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        return ResponseEntity.ok(Map.of("authenticated", true));
    }

    public record LoginRequest(@NotBlank String username, @NotBlank String password) {}
}
