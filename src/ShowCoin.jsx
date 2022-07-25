import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import parse from 'html-react-parser';


export default function ShowCoin(){
    
    const {id} = useParams();
    const [coin, setCoin] = useState();

    useEffect(()=>{
        if(!coin || (coin && (coin.id !== id))){
            fetch('https://api.coingecko.com/api/v3/coins/'+id, {headers: {accept: 'application/json'}})
            .then(response=>{response.json().then(response=>{
                setCoin(response)
                console.log('Petición: https://api.coingecko.com/api/v3/coins/'+id)
            });});
        }
    });

    return <>{coin && <>
        <img src={coin.image.large}></img>
        <img src={coin.image.small}></img>
        <img src={coin.image.thumb}></img>
        <div>
            {parse(coin.description.en)}
        </div>
    </>}</>
}