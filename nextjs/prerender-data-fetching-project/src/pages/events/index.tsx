import EventList from "@/components/events/event-list";
import { getAllEvents } from "../../../dummy-data";
import EventsSearch from "@/components/events/events-search";
import { useRouter } from "next/router";

function AllEventsPage() {
  const router = useRouter();
  const events = getAllEvents();

  function findEventsHandler(year: number, month: number) {
    const fullPath = `/events/${year}/${month}`;

    router.push(fullPath);
  }
  return (
    <>
      <EventsSearch onSearch={findEventsHandler} />
      <EventList items={events} />
    </>
  );
}

export default AllEventsPage;
