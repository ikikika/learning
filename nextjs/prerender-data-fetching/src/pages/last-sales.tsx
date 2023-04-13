import { useEffect, useState } from "react";

function LastSalesPage() {
  const [sales, setSales] = useState<SalesType[]>();
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

export default LastSalesPage;

interface SalesType {
  id: number | string;
  username: string;
  company: string;
}
