// src/pages/Liveness.tsx
import { useState } from "react";
import api from "../api";
import { Box, Button, Typography, CircularProgress } from "@mui/material";

export default function Liveness() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkLiveness = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    try {
      const res = await api.post("/check-spoofing-mn3", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(res.data);
    } catch (e: any) {
      setResult({ msg: e?.response?.data?.detail || "Liveness check failed" });
    }
    setLoading(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Liveness / Spoofing Check</Typography>
      <Button variant="outlined" component="label" sx={{ mb: 2 }}>
        Select Image
        <input type="file" hidden accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
      </Button>
      {file && <Typography>{file.name}</Typography>}
      <Button variant="contained" onClick={checkLiveness} disabled={!file || loading} sx={{ ml: 2 }}>
        {loading ? <CircularProgress size={20} /> : "Check"}
      </Button>
      {result && (
        <Box mt={3}>
          <Typography variant="subtitle1">Result:</Typography>
          <pre style={{ background: "#eee", padding: 12 }}>{JSON.stringify(result, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
}
