import path from "path";
import fs from "fs/promises";

import { Fragment } from "react";
import { ProductType } from "./product.type";

function ProductDetailPage(props: { loadedProduct: ProductType }) {
  // can useEffect to fetch data but that woudl not be loaded in SSR
  // if we get params here, it will not loaded in the server. need to get the param in getStaticProps

  const { loadedProduct } = props;

  // if fallback is true, need to prepare a fallabck state in case loadedProduct is not defined in getStaticPaths
  if (!loadedProduct) {
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

async function getData(): Promise<{ products: ProductType[] }> {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData.toString());
  return data;
}

// this runs before the component function runs
// this function tells nexths we want to render this page in advance
export async function getStaticProps(context: { params: { pid: string } }) {
  const { params } = context; // context by nextjs exposes params
  const productId = params.pid; // the only dynamic parameter here is pid, as per the filename

  const data = await getData();
  const product = data.products.find((product) => product.id === productId);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}

// if route is dynamic and has getStaticProps, we need a way to tell nextjs how many pages are required to be generated
export async function getStaticPaths() {
  const data = await getData();

  const ids = data.products.map((product) => product.id);
  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }));

  // must return with this structure
  return {
    paths: pathsWithParams,
    fallback: true,
    // when fallback is true, we tell nextjs that there are pages wehre params is not defined, but may still be valid
  };
}

export default ProductDetailPage;
