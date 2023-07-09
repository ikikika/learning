import { useRouter } from "next/router";
import { getEventById } from "../../../dummy-data";
import ErrorAlert from "@/components/ui/error-alert";
import EventSummary from "@/components/events/event-summary";
import EventLogistics from "@/components/events/event-logistics";
import EventContent from "@/components/events/event-content";

function EventDetailPage() {
  const router = useRouter();
  const eventId = router.query.eventId;
  const event =
    eventId && typeof eventId === "string" ? getEventById(eventId) : null;

  if (!event) {
    return (
      <ErrorAlert>
        <p>No event found!</p>
      </ErrorAlert>
    );
  }
  return (
    <>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </>
  );
}

export default EventDetailPage;
