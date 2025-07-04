// src/components/ApiKeyInput.tsx
import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

export default function ApiKeyInput({ onSet }: { onSet: () => void }) {
  const [key, setKey] = useState(localStorage.getItem("x-api-key") || "");

  return (
    <Box sx={{ my: 2 }}>
      <TextField
        label="API Key"
        value={key}
        size="small"
        onChange={e => setKey(e.target.value)}
        sx={{ mr: 2 }}
      />
      <Button
        variant="contained"
        onClick={() => {
          localStorage.setItem("x-api-key", key);
          onSet();
        }}
      >
        Set Key
      </Button>
    </Box>
  );
}
