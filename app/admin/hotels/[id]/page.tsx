interface ViewHotelProps {
    params: { id: string }
}

export default async function ViewHotel({ params }: ViewHotelProps) {
    const data = await fetch(
        `https://api-hotels-node-3ae790f3666e.herokuapp.com/api/hotels/${params.id}`
    );

    const posts = await data.json();

    console.log(posts)
    return (
        <>
            <h1> </h1>
        </>
    );
}