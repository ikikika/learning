// none of this code runs on client side. all runs on dev server
import path from "path"; // core nodejs module. no need install
import fs from "fs/promises"; // core nodejs module. no need install

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
  console.log("(Re-)Generating...");
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json"); // process is globally availabel on nodejs
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData.toString());

  if (!data) {
    return {
      redirect: {
        destination: "/no-data",
      },
    };
  }

  if (data.products.length === 0) {
    return { notFound: true };
  }

  // always need to return props. this function prepares props for the component
  return {
    props: {
      products: data.products,
    },
    revalidate: 10,
  };
}

export default HomePage;

interface ProductType {
  id: string;
  title: string;
}
