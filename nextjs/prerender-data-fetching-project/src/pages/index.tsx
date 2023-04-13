import EventList from "@/components/events/event-list";
import { getFeaturedEvents } from "@/helpers/api-util";
import { EventType } from "@/types/event.type";

function HomePage(props: { events: EventType[] }) {
  return (
    <div>
      <EventList items={props.events} />
    </div>
  );
}

export async function getStaticProps() {
  const featuredEvents = await getFeaturedEvents();

  return {
    props: {
      events: featuredEvents,
    },
    revalidate: 1800,
  };
}

export default HomePage;
