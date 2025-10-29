type Hotel = {
  title: string;
  _id: number;
  numberOfRooms: string;
  address: string;
};

export default async function Home() {
  const data = await fetch(
    "https://api-hotels-node-3ae790f3666e.herokuapp.com/api/hotels"
  );
  console.log(typeof data);
  const posts = await data.json();
  return (
    <ul>
      {posts.data.map((post) => (
        <li key={post._id}>{post.title}</li>
      ))}
    </ul>
  );
}
