// none of this code runs on client side. all runs on dev server

// props returned from getStaticProps
function HomePage(props: { products: ProductType[] }) {
  const { products } = props;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  );
}

// if we have this function in our component, this function will be executed first
export async function getStaticProps() {
  // always need to return props. this function prepares props for the component
  return {
    props: {
      products: [
        { id: "p1", title: "Product 1" },
        { id: "p2", title: "Product 2" },
      ],
    },
    revalidate: 10,
  };
}

export default HomePage;

interface ProductType {
  id: string;
  title: string;
}
