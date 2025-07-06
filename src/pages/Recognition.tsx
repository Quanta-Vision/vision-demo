import React, { useState } from "react";
import { Button, Box, Typography, Stack, Paper, CircularProgress } from "@mui/material";

export default function Recognition() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setResult(null);
      setError(null);
    }
  };

  const handleRecognize = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiKey = localStorage.getItem("x-api-key") || "";
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch("http://127.0.0.1:8001/v2/recognize", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
        },
        body: formData,
      });

      if (!res.ok) {
        const errMsg = await res.text();
        setError(errMsg || "Recognition failed");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 5, ml: 6 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Recognition</Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="outlined"
          component="label"
        >
          SELECT IMAGE
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!image || loading}
          onClick={handleRecognize}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "RECOGNIZE"}
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
              border: "1px solid #eee"
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
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      {result && (
        <Paper sx={{ mt: 2, p: 2 }}>
          {result.personInfo && (
            <Box sx={{ mb: 1 }}>
              <Typography>Name: <strong>{result.personInfo.name}</strong></Typography>
              <Typography>ID: <strong>{result.personInfo.user_id}</strong></Typography>
              <Typography>Consumer: <strong>{result.personInfo.consumer}</strong></Typography>
            </Box>
          )}
        </Paper>
      )}
      {result && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Typography variant="body2" color="textSecondary">Raw JSON:</Typography>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </Paper>
      )}
    </Box>
  );
}
