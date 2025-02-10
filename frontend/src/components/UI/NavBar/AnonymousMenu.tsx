import { Button, Divider } from "@mui/material";
import { Link as NavLink } from "react-router-dom";
import Grid from "@mui/material/Grid2";

const AnonymousMenu = () => {
  return (
    <Grid display="flex">
      <Button component={NavLink} to="/register" color="inherit">
        Sign up
      </Button>
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          borderColor: "white",
          height: "2rem",
          alignSelf: "center",
          marginX: 1,
        }}
      />
      <Button component={NavLink} to="/login" color="inherit">
        Sign in
      </Button>
    </Grid>
  );
};

export default AnonymousMenu;
