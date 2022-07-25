import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import Portfolio from "./Portfolio";

export default function Portfolios() {

  const [portfolios, setPortfolios] = useState(localStorage.getItem("portfolios") !== "undefined" ? JSON.parse(localStorage.getItem("portfolios")) : undefined);

  useEffect(()=>{
    localStorage.setItem("portfolios", JSON.stringify(portfolios));
    
    const portfsIds = setInterval(()=>{update()}, 1000);
    return ()=>{
      clearInterval(portfsIds);
    }
  })

  const addNewPortfolio = ()=>{

    let newPort;
    if(portfolios !== undefined){
      newPort = [ ...portfolios, {name: "New Portfolio", coins: [], amounts: []}];
    }else{
      newPort = [ { name: "New Portfolio", coins: [], amounts: []}];
    }

    //localStorage.setItem("portfolios", newPort)
    setPortfolios(newPort)
  }

  const deleteAllPortfolios = ()=>{
    setPortfolios(undefined)
  }

  const save = (idx, portf)=>{
    setPortfolios([...portfolios.slice(0,idx), portf, ...portfolios.slice(idx+1, portfolios.length)])
  }
  const deletePortfolio = ev=>{
    ev.stopPropagation();
    console.log(ev.target.id)
  }

  const update = async ()=>{
    const newPortfs = portfolios;
    const coinsToUpdate = [];

    for(let p in portfolios){
      for (let c in portfolios[p].coins){
        coinsToUpdate.push(portfolios[p].coins[c].symbol);
      }
    }
    const uniq = [...new Set(coinsToUpdate)]
    let urlQuery = 'https://api.binance.com/api/v3/ticker/price?symbols=%5B';

    for (let i in uniq){
      urlQuery += (i > 0 ? '%2C' : '') + "%22" +uniq[i].toUpperCase()+"USDT" + "%22";
    }
    urlQuery += "%5D"
    const response = await (await fetch(urlQuery, {headers: {accept: "application/json"}})).json();


    for(let p in portfolios){
      for (let c in portfolios[p].coins){
        for(let r in response){
          if(response[r].symbol.toLowerCase().slice(0, response[r].symbol.length - 4) === portfolios[p].coins[c].symbol){
            newPortfs[p].coins[c].current_price = response[r].price;
            break;
          }
        }
      }
    }

    setPortfolios([...newPortfs])
  }

  const toShow = [];

  if(portfolios)
    for(let i in portfolios){
      toShow.push(<div key={"portfolio-"+i}>
        <Portfolio deletePortfolio={deletePortfolio} save={save} ptf={portfolios[i]} idx={i}></Portfolio>
      </div>);
    }

  return (<>
    <Button style={{margin: "10px"}} variant="outlined" onClick={addNewPortfolio}>Add portfolio</Button>
    <Button style={{margin: "10px"}} variant="outlined" onClick={deleteAllPortfolios}>Delete portfolios</Button>
    {toShow}
  </>
  );
}

