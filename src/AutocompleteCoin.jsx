import { TableRow, TableCell, TableContainer, Table, ThemeProvider, TableBody } from "@mui/material";
import { useEffect, useState } from "react";
import theme from "./theme";
import Paper from '@mui/material/Paper';
import { colors } from "@react-spring/shared";

export default function AutocompleteCoin({setShowAddCoin, addCoin}){

    const [coinToAdd, setCoinToAdd] = useState();
    const [coins, setCoins] = useState(localStorage.getItem("coinList") !== "undefined" ? JSON.parse(localStorage.getItem("coinList")) : undefined);
    const [searchArr, setSearchArr] = useState([]);
    const [showSearch, setShowSearch] = useState(false);

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
    })
    const colors = theme.palette.secondary;

    const esc=(ev)=>{
        if(ev.keyCode === 27)
            setShowAddCoin(false)
    }

    const searchCoin = (ev)=>{
        const word = ev.target.value;
        // startShowingLength ha de ser > 2 siempre
        const startShowingLength = 2;
        if(word.length <= startShowingLength - 2) {
            setShowSearch(false)
            setCoinToAdd(word);
            return;
        }
        let arr;

        if(coinToAdd && word.length > coinToAdd.length && word.length > startShowingLength - 1){
            arr = searchArr;
            setShowSearch(true)
        }else{
            arr = coins;
            setShowSearch(word.length > startShowingLength - 1);
        }
        const matches = arr.filter(coin =>{
            const regex = new RegExp(word, "i");
            return coin.id.match(regex) || coin.symbol.match(regex);
        });
        setSearchArr(matches);
        setCoinToAdd(word);
    }

    const arr = showSearch ? searchArr : coins ;
    const toShow = [];
    for(let i in arr){
        toShow.push(<TableRow key={arr[i] + "-" + i} sx={{ backgroundColor: colors.dark, cursor: "pointer"}} >
            <TableCell onClick={()=>addCoin(arr[i])}>
                <div style={{color: colors.contrastText, display: "flex"}}>
                    <img style={{width: "20px", marginRight: "15px"}} src={arr[i].image}/>
                    {arr[i].name}
                </div>
            </TableCell>
        </TableRow>);
    }

    

    {/*onBlur={(ev)=>{setShowAddCoin(false)}}*/}
    return <>
    <input
    onKeyDown={esc}
    style={{backgroundColor: "black", color: colors.contrastText, border: "none"}}
    onChange={searchCoin}
    autoFocus={"on"}
    type={"text"}/>
    <div style={autocomplete_style}>
        <ThemeProvider theme={theme}>
            <TableContainer component={Paper}>
                <Table sx={{ maxWidth: "400px" }} aria-label="simple table">
                    <TableBody>
                        {toShow}
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>
    </div>
    </>
}
const autocomplete_style ={
    marginLeft: "120px",
    maxWidth: "240px",
    border: "none",
    maxHeight: "200px",
    scrollbarColor: "rebeccapurple transparent",
    overflowY: "scroll"
}