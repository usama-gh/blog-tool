// a bunch of loading divs

export default function Loading() {
  return (
    <>
      <div className="h-10 w-48 animate-pulse rounded-md bg-slate-100 dark:bg-gray-900" />
      <div className="h-96 w-full max-w-screen-md animate-pulse rounded-md bg-slate-100 dark:bg-gray-900" />
    </>
  );
}
