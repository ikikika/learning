import EventList from "@/components/events/event-list";
import { getFeaturedEvents } from "../../dummy-data";

function HomePage() {
  const featuredEvents = getFeaturedEvents();
  return (
    <div>
      <div>
        <EventList items={featuredEvents} />
      </div>
    </div>
  );
}

export default HomePage;
