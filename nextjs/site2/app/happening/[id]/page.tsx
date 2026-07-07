import EventsData from "@/data/events";
import Image from "next/image";

const Event = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const event = EventsData.find(e => e.id === resolvedParams.id);

  if (!event) {
    return <div>Event not found.</div>;
  }

  return (
    <div>
      <div>
        {event.image && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
            <Image
              src={event.image}
              alt={event.title}
              style={{
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: "1.5rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
              }}
              width={600}
              height={300}
            />
          </div>
        )}
        <h2 style={{ marginBottom: "0.5rem", fontSize: "2rem", fontWeight: 600 }}>{event.title}</h2>
        <p style={{ color: "#1976d2", marginBottom: "1rem", fontWeight: 500 }}>{event.date}</p>
        <p style={{ marginBottom: "1rem", lineHeight: 1.6 }}>{event.longDescription || event.description}</p>
        {event.location && (
          <div style={{ fontStyle: "italic", marginTop: "0.5rem" }}>
            Location: {event.location}
          </div>
        )}
      </div>
    </div>
  );
}
export default Event