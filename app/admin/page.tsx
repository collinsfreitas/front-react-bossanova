export default async function Admin() {
  const data = await fetch(
    "https://api-hotels-node-3ae790f3666e.herokuapp.com/api/hotels"
  );
  console.log(typeof data);
  const posts = await data.json();
  return (
    <>
      {posts._id}
    </>
  );
}