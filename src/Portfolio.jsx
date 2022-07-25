import { ThemeProvider } from "@emotion/react";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { useEffect, useState } from "react"
import theme from "./theme";
import { Spring, Transition, animated } from "react-spring";
import AutocompleteCoin from "./AutocompleteCoin";

export default function Portfolio({idx, ptf, save, deletePortfolio}){
    const [portfolio, setPortfolio] = useState(ptf);
    const [newName, setNewName] = useState(portfolio.name);
    const [showPortf, setShowPortf] = useState(false);
    const [chName, setChName] = useState(false);
    const [showAddCoin, setShowAddCoin] = useState(false);
    const [showBuySellInput, setShowBuySellInput] = useState([idx, 0, false, ""]);
    const [buySell, setBuySell] = useState("");

    const colors = theme.palette.secondary;
    useEffect(()=>{
        //console.log(buySell)
        //console.log(coinToAdd)
    });

    const saveName = ()=>{
        //Falta en local storage
        portfolio.name = newName;
        setPortfolio(portfolio)
        save(idx, portfolio);
        setChName(!chName);
    }
    const checkEnter = ev=>{if(ev.keyCode === 13)saveName();}

    const addCoin = (c)=>{
        setShowAddCoin(false);
        const ptf = portfolio;
        ptf.coins.push(c);
        ptf.amounts.push(0);
        setPortfolio(ptf);
        save(idx, portfolio)
    }
    const deleteCoin = (index)=>{
        const ptf = portfolio;
        ptf.coins.splice(index, 1);
        ptf.amounts.splice(index, 1);
        setPortfolio(ptf);
        save(idx, ptf)
    }
    const buy = (index, amount)=>{
        const ptf = portfolio;
        ptf.amounts[index] += amount;
        setPortfolio(ptf)
        save(idx, ptf)
    }
    const sell = (index, amount)=>{
        buy(index, -amount);
    }
    const sellAll = (index)=>{
        buy(index, -portfolio.amounts[index]);
    }
    const checkBuySell = (ev)=>{
        if(ev.keyCode === 13){
            if(showBuySellInput[3] === "buy"){
                buy(parseInt(ev.target.id.split("-")[2]), parseFloat(buySell))
            }else if(showBuySellInput[3] === "sell"){
                sell(parseInt(ev.target.id.split("-")[2]), parseFloat(buySell))
            }
            setShowBuySellInput([parseInt(ev.target.id.split("-")[1]), parseInt(ev.target.id.split("-")[2]), false, ""])
        }else if(ev.keyCode === 27){
            setShowBuySellInput([parseInt(ev.target.id.split("-")[1]), parseInt(ev.target.id.split("-")[2]), false, ""])
        }
    }

    const toShow = []
    if(portfolio)
        for(let i in portfolio.coins){
            
            toShow.push(<TableRow key={"ownedCoin"+i+portfolio.coins[i]} sx={{backgroundColor: "black"}}>
                <TableCell sx={{color: colors.contrastText}}><div style={{display: "flex"}}><img style={{marginRight:"10px", marginLeft: "10px", width: "30px"}} src={portfolio.coins[i].image}/><div style={{marginTop: "9px"}}>{portfolio.coins[i].name}</div></div></TableCell>
                <TableCell sx={{paddingTop: "27px", color: colors.contrastText}}>$ {portfolio.coins[i].current_price !== undefined ? parseFloat(portfolio.coins[i].current_price).toPrecision(8) : "ERROR"}</TableCell>
                <TableCell sx={{paddingTop: "27px", color: colors.contrastText}}>{(portfolio.amounts[i]).toFixed(8)}</TableCell>
                <TableCell sx={{paddingTop: "27px", color: colors.contrastText}} >$ { portfolio.coins[i].current_price !== undefined ? (portfolio.coins[i].current_price * portfolio.amounts[i]).toFixed(2) : "ERROR"}</TableCell>
                
                <TableCell sx={{paddingTop: "27px", color: colors.contrastText}} align="right">
                    <div style={{ width: "50px", display: "flex", flexDirection: "row"}}>

                        { parseInt(showBuySellInput[0]) === parseInt(idx) &&
                        parseInt(showBuySellInput[1]) === parseInt(i) &&
                        showBuySellInput[2] &&
                        <input
                        id={"buySell-i-"+i}
                        onKeyDown={checkBuySell}
                        onBlur={ev=>{setShowBuySellInput([parseInt(ev.target.id.split("-")[1]), parseInt(ev.target.id.split("-")[2]), !showBuySellInput[2], ""])}}
                        type="text"
                        style={{color: "white",
                            backgroundColor: "black",
                            border: "none" ,
                            height: "18px",
                            width: "70px",
                            marginLeft: "-78px",
                            marginTop: showBuySellInput[3] === "sell"? "43px" : "10px"}}
                        onChange={(ev)=>setBuySell(ev.target.value)}
                        autoFocus="on"/> }
                        <div style={{width: "70px",display: "flex", flexDirection: "column"}}>
                            <Button style={{color: "green"}} id={"buysell-"+idx+"-"+i} onClick={ev=>{setShowBuySellInput([parseInt(ev.target.id.split("-")[1]), parseInt(ev.target.id.split("-")[2]), true, "buy"])}}>buy</Button>
                            <Button style={{color: "#aa5555"}} id={"buysell-"+idx+"-"+i} onClick={ev=>{setShowBuySellInput([parseInt(ev.target.id.split("-")[1]), parseInt(ev.target.id.split("-")[2]), true, "sell"])}}>sell</Button>
                        </div>
                        <div style={{width: "70px",display: "flex", flexDirection: "column"}}>
                            <Button style={{color: "gray"}} onClick={()=>deleteCoin(i)}>delete</Button>
                            <Button style={{color: "#770000"}} onClick={()=>{sellAll(i)}}>sell_all</Button>
                        </div>
                    </div>
                </TableCell>

            </TableRow>);
        }

    const options = localStorage.getItem("coinList")  === "undefined" || localStorage.getItem("coinList")  === null ? [] : JSON.parse(localStorage.getItem("coinList")).map(coin=>{return coin.id})
    
    let total = 0;
    for(let i in portfolio.coins){
        total += portfolio.coins[i].current_price !== undefined ? portfolio.coins[i].current_price * portfolio.amounts[i] : 0;
    }

    return <>
    <div style={{border: "1px solid white", borderRadius: "5px", padding: "30px", cursor: "pointer", marginTop: "15px", display: "flex", justifyContent: "space-between"}} onClick={()=>{setShowPortf(!showPortf)}}>
        {(! chName &&
            <div style={{width: "150px", fontFamily: "roboto"}} onClick={ev=>{setChName(!chName); ev.stopPropagation()}}>{portfolio.name}</div> ||
            <input style={{border: "none", fontSize: "16px", outline: "none", width: "150px", fontFamily: "roboto", backgroundColor: "black", color: "white"}} onKeyDown={checkEnter} onBlur={ev=>{saveName()}} value={newName} autoFocus="on" onChange={ev=>setNewName(ev.target.value)} onClick={ev=>ev.stopPropagation()}/>)
        }
        <div style={{width: "70%"}}></div>
        <div style={{height: 0, marginTop: "-8px" }}>
            <Button id={"delPortf-"+idx} onClick={deletePortfolio}>delete</Button>
        </div>
        <div style={{fontFamily: "roboto"}}>
            $ {total.toFixed(2)}
        </div>
    </div>
    {/* Convertir en clase para poder usar la Transition
    <Transition native items={showPortf} from={{opacity: 0}} to={{opacity: 1}} leave{{opacity: 0}}>
        {show => show && (props)=>(
            <animated.div>
                <Spring from={{opacity: 0}} to={{opacity: 1}}>{props=>{<div style={props}>
                    <ThemeProvider theme={theme}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableBody>
                                    {toShow}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </ThemeProvider>
                    <Button variant="outlined" style={{margin: "10px"}}>Add coin</Button>
                </div>}}</Spring>
            </animated.div>
        )}
    </Transition>
    */}

    {showPortf && <>
        <ThemeProvider theme={theme}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                        {toShow}
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>
            <Button variant="outlined" style={{margin: "10px"}} onClick={()=>setShowAddCoin(true)}>Add coin</Button>
            {showAddCoin && <>
            <AutocompleteCoin addCoin={addCoin} setShowAddCoin={setShowAddCoin}></AutocompleteCoin>
            </>}
    </>}
    </>
}