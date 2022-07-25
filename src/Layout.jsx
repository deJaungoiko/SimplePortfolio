import { AppBar, Button, Container, Grid, ThemeProvider } from "@mui/material";
import { Link, Outlet } from "react-router-dom"
import { Box } from "@mui/system";
import theme from "./theme"
import { useEffect } from "react";


export default function Layout() {

  return (<>
  <Box sx={{flexGrow: 1}}>
    <ThemeProvider theme={theme}>
      <AppBar color="primary">
          <div style={{display:"flex", justifyContent: "space-between", width:"100%"}}>
            <Button style={{height: "75px", paddingLeft: "30px", paddingRight: "30px"}} color="inherit" component={Link} to="/">Home</Button>
            <Container>          
                <Button style={{height: "75px", paddingLeft: "30px", paddingRight: "30px"}} color='inherit' component={Link} to='/portfolio'>Portfolio</Button>
                <Button style={{height: "75px", paddingLeft: "30px", paddingRight: "30px"}} color='inherit' component={Link} to='/'>List</Button>
            </Container>
          </div>
      </AppBar>
    </ThemeProvider>
  </Box>
  <div style={{height: "80px"}}/>

  <Grid container spacing={0}>
      
      <Grid item xs={2}>
  
      </Grid>
      <Grid item xs={8}>
        <Outlet/>
      </Grid>
      <Grid item xs={2}>
  
      </Grid>
  
    </Grid>
  </>
  );
}