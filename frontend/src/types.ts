export interface Telemetry {
  absolute_magnitude: number;
  est_diameter_max: number;
  relative_velocity: number;
  miss_distance: number;
}

export interface PredictionResult {
  prediction: {
    hazard_probability: number;
    status: string;
  };
  explanation: {
    base_value: number;
    attributions: Array<{ feature: string; value: number }>;
  };
}