package com.gesalqveh.operador.client;

import com.gesalqveh.operador.client.dto.VehiculoDto;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.Optional;

@Component
public class BuscadorClient {

    private static final String BASE = "http://buscador";
    private final WebClient webClient;

    public BuscadorClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl(BASE).build();
    }

    public Optional<VehiculoDto> findVehiculo(Long id) {
        return get("/vehiculos/" + id, VehiculoDto.class);
    }

    private <T> Optional<T> get(String path, Class<T> type) {
        try {
            T body = webClient.get()
                    .uri(path)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, r -> r.createException())
                    .bodyToMono(type)
                    .timeout(Duration.ofSeconds(5))
                    .block();
            return Optional.ofNullable(body);
        } catch (WebClientResponseException.NotFound nf) {
            return Optional.empty();
        }
    }
}
