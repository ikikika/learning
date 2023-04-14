import { EventType } from "@/types/event.type";
import EventItem from "./event-item";
import classes from "./event-list.module.css";

function EventList(props: { items: EventType[] }) {
  const { items } = props;

  return (
    <ul className={classes.list}>
      {items.map((event) => (
        <EventItem
          key={event._id as string}
          id={event._id as string}
          title={event.title}
          location={event.location}
          date={event.date}
          image={event.image}
        />
      ))}
    </ul>
  );
}

export default EventList;
