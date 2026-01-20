import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";


export default async function Users() {
  // const data = await fetch(
  //   "https://api-hotels-node-3ae790f3666e.herokuapp.com/api/hotels"
  // );
  // console.log(typeof data);
  // const posts = await data.json();
  return (
    <>
      <h1 className="text-2xl">Usuários</h1>
      <Separator className="my-4" />
    </>
  );
}