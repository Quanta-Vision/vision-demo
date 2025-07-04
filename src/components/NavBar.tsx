// src/components/NavBar.tsx
import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">Dashboard</Button>
        <Button color="inherit" component={Link} to="/persons">Persons</Button>
        <Button color="inherit" component={Link} to="/recognition">Recognition</Button>
        <Button color="inherit" component={Link} to="/liveness">Liveness</Button>
        <Button color="inherit" component={Link} to="/api-docs">API Docs</Button>
      </Toolbar>
    </AppBar>
  );
}
