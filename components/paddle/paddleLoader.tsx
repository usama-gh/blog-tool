import { PaddleSDK } from 'paddle-sdk';
import React from 'react'

async function paddleLoad(){
  const client = new PaddleSDK(
		'107521',
		'118ca00ad35f962021f59154b6370f248cf4d71c70aa2e5c5b'
	);
  const products = await client.getProducts();
	console.log(products, products.total);
}

export default function PaddleLoader() {
  paddleLoad()
  return (
    <div></div>
  )
}
