package com.project.management.ai;

public class AiPredictionResponse {

    private String risk;
    private double confidence;

    public AiPredictionResponse() {
    }

    public String getRisk() {
        return risk;
    }

    public void setRisk(String risk) {
        this.risk = risk;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }
}
