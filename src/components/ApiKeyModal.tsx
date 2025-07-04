// src/components/ApiKeyModal.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, InputAdornment, Box, Typography, Fade } from "@mui/material";
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

export default function ApiKeyModal({ open, onSet }: { open: boolean; onSet: (key: string) => void }) {
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);

  const handleSet = () => {
    if (key.trim()) {
      localStorage.setItem("x-api-key", key.trim());
      onSet(key.trim());
      setKey("");
    }
  };

  return (
    <Dialog open={open} disableEscapeKeyDown TransitionComponent={Fade} PaperProps={{
      sx: { borderRadius: 4, boxShadow: 10, minWidth: 400 }
    }}>
      <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
        <LockRoundedIcon sx={{ fontSize: 48, color: "primary.main" }} />
      </Box>
      <DialogTitle sx={{ textAlign: "center", fontWeight: 600, fontSize: 24, pt: 1 }}>
        Welcome!  
      </DialogTitle>
      <Typography sx={{ textAlign: "center", color: "text.secondary", mb: 2 }}>
        Please enter your API Key to access the service.
      </Typography>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="API Key"
          fullWidth
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSet()}
          type={show ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle key visibility"
                  onClick={() => setShow(v => !v)}
                  edge="end"
                >
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ mt: 2, mb: 1, borderRadius: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 3, pl: 3 }}>
        <Button
          onClick={handleSet}
          variant="contained"
          size="large"
          disabled={!key.trim()}
          fullWidth
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Set API Key
        </Button>
      </DialogActions>
    </Dialog>
  );
}
