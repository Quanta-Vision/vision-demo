// src/App.tsx
import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, Box, Container } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Persons from "./pages/Persons";
import Recognition from "./pages/Recognition";
import Liveness from "./pages/Liveness";
import ApiKeyModal from "./components/ApiKeyModal";

const NAV_BUTTON_STYLE = { color: "#fff", fontWeight: 500, textTransform: "none", marginRight: 2 };

export default function App() {
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem("x-api-key"));

  // Sync across tabs/windows
  useEffect(() => {
    const handler = () => setApiKey(localStorage.getItem("x-api-key"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
  };

  const handleChangeKey = () => {
    localStorage.removeItem("x-api-key");
    setApiKey(null);
  };

  return (
    <Router>
      {/* Modal blocks until apiKey is set */}
      <ApiKeyModal open={!apiKey} onSet={handleApiKeySet} />
      {apiKey && (
        <Box>
          <AppBar position="static">
            <Toolbar>
              <Button component={Link} to="/" sx={NAV_BUTTON_STYLE}>
                PERSONS
              </Button>
              <Button component={Link} to="/recognition" sx={NAV_BUTTON_STYLE}>
                RECOGNITION
              </Button>
              <Button component={Link} to="/liveness" sx={NAV_BUTTON_STYLE}>
                LIVENESS
              </Button>
              {/* Spacer */}
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="outlined"
                sx={{ color: "#fff", borderColor: "#fff" }}
                onClick={handleChangeKey}
              >
                Change API Key
              </Button>
            </Toolbar>
          </AppBar>
          <Box sx={{ background: "#f8f8f8", minHeight: "100vh" }}>
            <Container maxWidth="lg" sx={{ pt: 3 }}>
              <Routes>
                <Route path="/" element={<Persons />} />
                <Route path="/recognition" element={<Recognition />} />
                <Route path="/liveness" element={<Liveness />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      )}
    </Router>
  );
}
