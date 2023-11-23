import EventSummary from "@/components/events/event-summary";
import EventLogistics from "@/components/events/event-logistics";
import EventContent from "@/components/events/event-content";
import { getEventById, getFeaturedEvents } from "@/helpers/api-util";
import { EventType } from "@/types/event.type";
import Head from "next/head";

function EventDetailPage(props: { selectedEvent: EventType }) {
  const event = props.selectedEvent;

  if (!event) {
    return (
      <div>
        <p>Loading</p>
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>{event.title}</title>
        <meta name="description" content={event.description} />
      </Head>
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

export async function getStaticProps(context: { params: { eventId: string } }) {
  const eventId = context.params.eventId;

  const event = await getEventById(eventId);

  return {
    props: {
      selectedEvent: event,
    },
    revalidate: 30,
  };
}

export async function getStaticPaths() {
  const events = await getFeaturedEvents();

  const paths = events.map((event) => ({ params: { eventId: event.id } }));

  return {
    paths: paths,
    fallback: "blocking",
  };
}

export default EventDetailPage;
