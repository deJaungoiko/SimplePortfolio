
import { Table, TableContainer, TableHead, TableRow, TableCell, ThemeProvider, TableBody, Button } from "@mui/material";
import { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import theme from "./theme";

export default function CoinList(){
    const [coins, setCoins] = useState(localStorage.getItem("coinList") !== "undefined" ? JSON.parse(localStorage.getItem("coinList")) : undefined);

    useEffect(()=>{
        localStorage.setItem("coinList", JSON.stringify(coins));

        if(coins === undefined || coins === "undefined")
            fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc', {headers: {accept: "application/json"}})
            .then((response)=>{
                response.json().then(response=>{
                    console.log('Petición: https://api.coingecko.com/api/v3/coins/list');
                    setCoins(response);
                });
            }).catch(error=>{
                console.log(error);
            });
    }, [coins]);

    const update = ()=>{
        setCoins(undefined)
    }
    const colors = theme.palette.secondary;


    const toShow = [];
    for(let i in coins){
        //onClick={ev=>{console.log(coins[i].id)}}  <Link style={{color: colors.contrastText, textDecoration: "none" }} to={"coins/"+coins[i].id}></Link>
        toShow.push(<TableRow key={coins[i]+"-"+i+"-CoinList"} sx={{backgroundColor: colors.light, cursor: "pointer"}} onClick={ev=>{window.location="http://localhost:3000/coins/"+(coins[i].id)}}>
                <TableCell sx={{color: colors.contrastText}}><div style={{display: "flex"}}><img style={{height: "20px", marginRight: "10px"}} src={coins[i].image}></img>{coins[i].name}</div></TableCell>
                <TableCell sx={{color: colors.contrastText}}><div> $ {coins[i].market_cap}</div></TableCell>
                <TableCell sx={{color: colors.contrastText}}><div> {coins[i].total_supply}</div></TableCell>
                <TableCell sx={{color: colors.contrastText}} align="right"><div> $ {coins[i].current_price}</div></TableCell>
            </TableRow>);
    }
    return <>
    <Button onClick={update}>Update</Button>
    <ThemeProvider theme={theme}>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow sx={{backgroundColor: colors.dark, "& th":{color: colors.contrastText}}}>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Market Cap</TableCell>
                    <TableCell>Total Supply</TableCell>
                    <TableCell align="right">Precio</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {toShow}
                </TableBody>
            </Table>
        </TableContainer>
    </ThemeProvider>
    </>
}