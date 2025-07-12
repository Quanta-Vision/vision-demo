import { useState } from "react";
import api from "../api";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Stack,
  Chip,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import SmartToyIcon from "@mui/icons-material/SmartToy";

interface AIAnalysisResult {
  status: "LIVE" | "SPOOF";
  confidence: number;
  reasoning: string;
  traditional_result?: {
    is_live: boolean;
    score: number;
    threshold: number;
  };
  processing_time?: number;
  msg?: string;
}

export default function AILivenessDetection() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [combineTraditional, setCombineTraditional] = useState(true);

  const checkAILiveness = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("ai_provider", "google_gemini");
    formData.append("combine_traditional", combineTraditional.toString());

    setLoading(true);
    setResult(null);

    try {
      const res = await api.post("/ai-spoof-detect/ai-analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ====== BEGIN: Normalize result for the UI ======
      const data = res.data;

      const normalized: AIAnalysisResult = {
        status: (data.ai_decision || data.status || "SPOOF").toUpperCase(), // use ai_decision if available
        confidence: data.final_confidence ?? data.ai_confidence ?? 0,
        reasoning: data.ai_reasoning || data.reasoning || "",
        processing_time: data.processing_time_ms ? data.processing_time_ms / 1000 : undefined,
        msg: data.msg,
        traditional_result: data.traditional_decision
          ? {
              is_live: data.traditional_decision === "Live" || data.traditional_decision === "LIVE",
              score: data.traditional_score ?? 0,
              threshold: data.traditional_threshold ?? 0.5,
            }
          : undefined,
      };
      setResult(normalized);
      // ====== END: Normalize result ======

    } catch (e: any) {
      setResult({ 
        status: "SPOOF",
        confidence: 0,
        reasoning: "Analysis failed",
        msg: e?.response?.data?.detail || "AI liveness check failed" 
      });
    }

    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setImagePreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "LIVE" ? <CheckCircleIcon /> : <ErrorIcon />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "success";
    if (confidence >= 0.6) return "warning";
    return "error";
  };

  // Custom Chip sx for LIVE green
  const liveChipSX = {
    bgcolor: "#43a047",
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: "bold",
    px: 1,
  };

  // Custom Chip sx for traditional result (smaller)
  const liveChipSmallSX = {
    bgcolor: "#43a047",
    color: "#fff",
    fontWeight: "bold",
    px: 1,
    fontSize: "0.95rem",
  };

  return (
    <Box sx={{ mt: 5, ml: 6, maxWidth: 800 }}>
      <Typography variant="h4" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
        <SmartToyIcon fontSize="large" />
        AI Liveness / Spoofing Detection
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Upload Image for Analysis
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Button variant="outlined" component="label">
            SELECT IMAGE
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            disabled={!file || loading}
            onClick={checkAILiveness}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SmartToyIcon />}
          >
            {loading ? "ANALYZING..." : "ANALYZE WITH AI"}
          </Button>

          {imagePreview && (
            <Paper
              elevation={3}
              sx={{
                width: 80,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: 2,
                border: "1px solid #eee",
              }}
            >
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Paper>
          )}
        </Stack>

        <FormControlLabel
          control={
            <Switch
              checked={combineTraditional}
              onChange={(e) => setCombineTraditional(e.target.checked)}
              color="primary"
            />
          }
          label="Combine with traditional detection methods"
        />
      </Paper>

      {result && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <SmartToyIcon />
            AI Analysis Results
          </Typography>

          {result.msg ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              <strong>{result.msg}</strong>
            </Alert>
          ) : (
            <>
              {/* Main Status */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Detection Status:
                </Typography>
                <Chip
                  icon={getStatusIcon(result.status)}
                  label={result.status}
                  sx={result.status === "LIVE" ? liveChipSX : {
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    px: 1,
                  }}
                  color={result.status === "LIVE" ? undefined : "error"}
                />
              </Box>

              {/* Confidence */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Confidence Score:
                </Typography>
                <Chip
                  label={`${(result.confidence * 100).toFixed(1)}%`}
                  color={getConfidenceColor(result.confidence)}
                  variant="outlined"
                  size="medium"
                />
              </Box>

              {/* AI Reasoning */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  AI Analysis Reasoning:
                </Typography>
                <Paper 
                  sx={{ 
                    p: 2, 
                    backgroundColor: "#f8f9fa", 
                    border: "1px solid #e9ecef",
                    borderRadius: 2 
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {result.reasoning}
                  </Typography>
                </Paper>
              </Box>

              {/* Traditional Results (if available) */}
              {result.traditional_result && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Traditional Detection Results:
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: "#f0f8ff", border: "1px solid #bde4ff" }}>
                    <Stack spacing={1}>
                      <Typography>
                        Status:{" "}
                        <Chip
                          label={result.traditional_result.is_live ? "LIVE" : "SPOOF"}
                          icon={getStatusIcon(result.traditional_result.is_live ? "LIVE" : "SPOOF")}
                          sx={result.traditional_result.is_live ? liveChipSmallSX : {
                            fontWeight: "bold",
                            px: 1,
                            fontSize: "0.95rem",
                          }}
                          color={result.traditional_result.is_live ? undefined : "error"}
                          size="small"
                        />
                      </Typography>
                      <Typography>
                        Score: <strong>{result.traditional_result.score?.toFixed(4)}</strong>
                      </Typography>
                      <Typography>
                        Threshold: <strong>{result.traditional_result.threshold}</strong>
                      </Typography>
                    </Stack>
                  </Paper>
                </Box>
              )}

              {/* Processing Time */}
              {result.processing_time && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Processing time: {result.processing_time.toFixed(2)}s
                </Typography>
              )}
            </>
          )}
        </Paper>
      )}

      {/* Raw JSON Debug Info */}
      {result && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
            Raw API Response:
          </Typography>
          <Box sx={{ 
            backgroundColor: "#f5f5f5", 
            p: 2, 
            borderRadius: 1,
            overflow: "auto",
            maxHeight: 300
          }}>
            <pre style={{ 
              margin: 0, 
              whiteSpace: "pre-wrap", 
              fontSize: "0.875rem",
              fontFamily: "monospace"
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
