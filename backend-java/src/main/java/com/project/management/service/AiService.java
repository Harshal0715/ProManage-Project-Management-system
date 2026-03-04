package com.project.management.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.project.management.ai.AiPredictionRequest;
import com.project.management.ai.AiPredictionResponse;

@Service
public class AiService {

    private final WebClient webClient;

    public AiService(@Value("${ai.service.url}") String aiBaseUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(aiBaseUrl)
                .build();
    }

    public AiPredictionResponse predict(String workspaceId,
                                        AiPredictionRequest request) {

        try {
            return webClient.post()
                    .uri("/predict")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(AiPredictionResponse.class)
                    .block();

        } catch (Exception e) {
            throw new RuntimeException("AI service unavailable for workspace: "
                    + workspaceId);
        }
    }
}