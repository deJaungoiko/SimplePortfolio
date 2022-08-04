import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import Portfolio from "./Portfolio";

export default function Portfolios() {

  const [portfolios, setPortfolios] = useState(localStorage.getItem("portfolios") !== "undefined" ? JSON.parse(localStorage.getItem("portfolios")) : undefined);
  const [invalidCoins, setInvalidCoins] = useState(["usdt"])

  useEffect(()=>{
    localStorage.setItem("portfolios", JSON.stringify(portfolios));
    
    const portfsIds = setInterval(()=>{update()}, 1000);
    return ()=>{
      clearInterval(portfsIds);
    }
  })

  const addNewPortfolio = ()=>{

    let newPort;
    if(portfolios !== undefined && portfolios !== null){
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

  const checkkSymbol = async (symbol)=>{
    const urlQuery = 'https://api.binance.com/api/v3/ticker/price?symbols=';
    try{
      await fetch(urlQuery+'%5B%22'+ symbol +'USDT%22%5D', {headers: {accept: "application/json"}})
      return {ok: true, symbol};
    }catch(error){
      return {ok: false, symbol};
    }

  }


  const update = async ()=>{
    //console.log(portfolios)
    const newPortfs = portfolios;
    const coinsToUpdate = [];
    let error = false;

    for(let p in portfolios){
      for (let c in portfolios[p].coins){
        if(! invalidCoins.includes(portfolios[p].coins[c].symbol))
          coinsToUpdate.push(portfolios[p].coins[c].symbol);
      }
    }
    if(coinsToUpdate.length > 0){
      const uniq = [...new Set(coinsToUpdate)]
      let urlQuery = 'https://api.binance.com/api/v3/ticker/price?symbols=%5B';

      for (let i in uniq){
        urlQuery += (i > 0 ? '%2C' : '') + "%22" +uniq[i].toUpperCase()+"USDT" + "%22";
      }
      urlQuery += "%5D"
      
      fetch(urlQuery, {headers: {accept: "application/json"}}).then(response=>{response.json().then(response=>{
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
      })}).catch(err=>{
        let i
        for(i in uniq){
          checkkSymbol(uniq[i].toUpperCase()).then(({ok, symbol})=>{
            if(!ok){
              setInvalidCoins([...invalidCoins, symbol.toLowerCase()]);
            }
          })
        }
      })
    }
  }

  const toShow = [];

  if(portfolios)
    for(let i in portfolios){
      toShow.push(<div key={"portfolio-"+i}>
        <Portfolio deletePortfolio={deletePortfolio} save={save} ptf={portfolios[i]} idx={i}></Portfolio>
      </div>);
    }

  return (<>
    <div style={{display:"flex"}}>
      <Button style={{margin: "10px"}} variant="outlined" onClick={addNewPortfolio}>Add portfolio</Button>
      <Button style={{margin: "10px"}} variant="outlined" onClick={deleteAllPortfolios}>Delete portfolios</Button>
      <div style={{width: "60%"}}></div>
      <div style={{fontFamily: "roboto", marginTop: "20px"}}> Total: $ {(()=>{
        let total = 0;
        for(let j in portfolios){
          for(let i in portfolios[j].coins){
              total += portfolios[j].coins[i].current_price !== undefined ? portfolios[j].coins[i].current_price * portfolios[j].amounts[i] : 0;
          }
        }
        return total.toFixed(2);
      })()}
      </div>
    </div>

    {toShow}
  </>
  );
}

