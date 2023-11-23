import EventList from "@/components/events/event-list";
import EventsSearch from "@/components/events/events-search";
import { getAllEvents } from "@/helpers/api-util";
import { EventType } from "@/types/event.type";
import Head from "next/head";
import { useRouter } from "next/router";

function AllEventsPage(props: { events: EventType[] }) {
  const router = useRouter();
  const { events } = props;

  function findEventsHandler(year: number, month: number) {
    const fullPath = `/events/${year}/${month}`;

    router.push(fullPath);
  }
  return (
    <>
      <Head>
        <title>All my events</title>
      </Head>
      <Head>
        <title>All Events</title>
        <meta
          name="description"
          content="Find a lot of great events that allow you to evolve..."
        />
      </Head>
      <EventsSearch onSearch={findEventsHandler} />
      <EventList items={events} />
    </>
  );
}

export async function getStaticProps() {
  const events = await getAllEvents();

  return {
    props: {
      events: events,
    },
    revalidate: 60,
  };
}

export default AllEventsPage;
