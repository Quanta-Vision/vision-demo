// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";
import Persons from "./pages/Persons";
import Recognition from "./pages/Recognition";
import Liveness from "./pages/Liveness";
import { useState } from "react";
import ApiKeyInput from "./components/ApiKeyInput";

export default function App() {
  const [apiKeySet, setApiKeySet] = useState(!!localStorage.getItem("x-api-key"));

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Persons</Button>
          <Button color="inherit" component={Link} to="/recognition">Recognition</Button>
          <Button color="inherit" component={Link} to="/liveness">Liveness</Button>
        </Toolbar>
      </AppBar>
      <ApiKeyInput onSet={() => setApiKeySet(true)} />
      <Routes>
        <Route path="/" element={<Persons />} />
        <Route path="/recognition" element={<Recognition />} />
        <Route path="/liveness" element={<Liveness />} />
      </Routes>
    </Router>
  );
}
