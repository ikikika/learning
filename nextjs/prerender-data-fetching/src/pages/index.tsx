// none of this code runs on client side. all runs on dev server
import path from "path"; // core nodejs module. no need install
import fs from "fs/promises"; // core nodejs module. no need install

import { ProductType } from "./products/product.type";
import Link from "next/link";

// props returned from getStaticProps
function HomePage(props: { products: ProductType[] }) {
  // can useEffect to fetch data but that woudl not be loaded in SSR
  const { products } = props;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </li>
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
    return { notFound: true }; // will show not found page if failed to fetch data
  }

  // always need to return props. this function prepares props for the component
  return {
    props: {
      products: data.products,
    },
    revalidate: 10, // for ISR, regenerate every 10 seconds
  };
}

export default HomePage;
