import { useState } from "react";
import api from "../api";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function Liveness() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkLiveness = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post("/check-spoofing-mn3", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (e: any) {
      setResult({ msg: e?.response?.data?.detail || "Liveness check failed" });
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

  return (
    <Box sx={{ mt: 5, ml: 6 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Liveness / Spoofing Check
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center">
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
          onClick={checkLiveness}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "CHECK"
          )}
        </Button>

        {imagePreview && (
          <Paper
            elevation={3}
            sx={{
              width: 64,
              height: 64,
              ml: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: 1,
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

      {result && (
        <Paper sx={{ mt: 2, p: 2 }}>
          {"is_live" in result && (
            <>
              <Typography>
                Liveness:{" "}
                <strong style={{ color: result.is_live ? "green" : "red" }}>
                  {result.is_live ? "Live" : "Spoof"}
                </strong>
              </Typography>
              <Typography>
                Score: <strong>{result.score?.toFixed(4)}</strong>
              </Typography>
              <Typography>
                Threshold: <strong>{result.threshold}</strong>
              </Typography>
            </>
          )}

          {result.msg && (
            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <WarningAmberIcon color="error" fontSize="small" />
              <Typography color="error">
                <strong>{result.msg}</strong>
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {result && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Raw JSON:
          </Typography>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </Paper>
      )}
    </Box>
  );
}
