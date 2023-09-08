"use client"

import Script from 'next/script'
import { PaddleSDK } from 'paddle-sdk';
import React from 'react'

async function paddleLoad(){
  const client = new PaddleSDK(
		'giveIdHere',
		'GiveTokenHere'
	);
  console.log(client);
  const products = await client.getProducts();
	console.log(products);
}

export default function PaddleLoader() {
  paddleLoad()
  return (
    
    // https://cdn.paddle.com/paddle/v2/paddle.js
    <Script src='https://cdn.paddle.com/paddle/paddle.js' onLoad={()=>{
        console.log('inn')
        // @ts-ignore
        Paddle.Environment.set("sandbox")
        // @ts-ignore
        Paddle.Setup({ vendor: 14048 })
    }}></Script>
  )
}
