import { useEffect, useState } from "react";

function LastSalesPage(props: { sales: SalesType[] }) {
  const [sales, setSales] = useState<SalesType[]>(props.sales);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        const transformedSales: SalesType[] = [];

        for (const key in data) {
          transformedSales.push({
            id: key,
            username: data[key].username,
            company: data[key].company.name,
          });
        }

        setSales(transformedSales);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!sales) {
    return <p>No data yet</p>;
  }

  console.log(sales);

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          {sale.username} - {sale.company}
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await response.json();

  const transformedSales = [];

  for (const key in data) {
    transformedSales.push({
      id: key,
      username: data[key].username,
      company: data[key].company.name,
    });
  }

  return { props: { sales: transformedSales } };
}

export default LastSalesPage;

interface SalesType {
  id: number | string;
  username: string;
  company: string;
}
