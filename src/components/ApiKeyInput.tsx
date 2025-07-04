// src/components/ApiKeyModal.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function ApiKeyModal({ open, onSet }: { open: boolean, onSet: (key: string) => void }) {
  const [key, setKey] = useState("");

  const handleSet = () => {
    if (key.trim()) {
      localStorage.setItem("x-api-key", key.trim());
      onSet(key.trim());
    }
  };

  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogTitle>Enter your API Key</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="API Key"
          fullWidth
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSet()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSet} variant="contained" disabled={!key.trim()}>Set Key</Button>
      </DialogActions>
    </Dialog>
  );
}
