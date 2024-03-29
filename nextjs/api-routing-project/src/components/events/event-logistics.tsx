import LogisticsItem from "./logistics-item";
import classes from "./event-logistics.module.css";
import Image from "next/image";
import DateIcon from "../icons/date-icon";
import AddressIcon from "../icons/address-icon";

function EventLogistics(props: {
  date: string;
  address: string;
  image: string;
  imageAlt: string;
}) {
  const { date, address, image, imageAlt } = props;

  const humanReadableDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const addressText = address; //.replace(", ", "\n");

  return (
    <section className={classes.logistics}>
      <div className={classes.image}>
        <Image src={`/${image}`} alt={imageAlt} width={300} height={200} />
      </div>
      <ul className={classes.list}>
        <LogisticsItem icon={DateIcon}>
          <time>{humanReadableDate}</time>
        </LogisticsItem>
        <LogisticsItem icon={AddressIcon}>
          <address>{addressText}</address>
        </LogisticsItem>
      </ul>
    </section>
  );
}

export default EventLogistics;
