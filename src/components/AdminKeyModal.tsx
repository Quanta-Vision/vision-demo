// src/components/AdminKeyModal.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from "@mui/material";
import { useState } from "react";

export default function AdminKeyModal({ open, onSet }: { open: boolean; onSet: (key: string) => void }) {
  const [key, setKey] = useState("");
  return (
    <Dialog open={open}>
      <DialogTitle>Enter Admin Key</DialogTitle>
      <DialogContent>
        <TextField
          label="Admin Key"
          type="password"
          fullWidth
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === "Enter" && key.trim() && (onSet(key.trim()), setKey(""))}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { onSet(key.trim()); setKey(""); }} disabled={!key.trim()} variant="contained">
          Set Admin Key
        </Button>
      </DialogActions>
    </Dialog>
  );
}
