import { useRouter } from "next/router";

function EventDetailPage() {
  const router = useRouter();
  const eventId = router.query.eventId;

  return (
    <div>
      <h1>Event Detail {eventId}</h1>
    </div>
  );
}

export default EventDetailPage;
