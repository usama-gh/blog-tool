import Script from "next/script";

export function PaddleLoader() {
  return (
    <Script
      src="https://cdn.paddle.com/paddle/paddle.js"
      onLoad={() => {
        if (process.env.NEXT_PUBLIC_PADDLE_SANDBOX) {
          // @ts-ignore
          Paddle.Environment.set("sandbox");
        }
        // @ts-ignore
        Paddle.Setup({
          vendor: Number(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID),
        });
      }}
    />
  );
}
