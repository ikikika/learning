import EventsData, { EventType } from "@/data/events"
import Image from "next/image"
import Link from "next/link"


const Events = () => {
  return (
    <div style={{ margin: "2rem auto", padding: "1rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
      <h2 style={{ marginBottom: "1.5rem", fontSize: "2rem", fontWeight: 600, color: "#4a5568" }}>Events</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {EventsData.map((event: EventType) => (
          <li key={event.id} style={{ display: "flex", alignItems: "flex-start", marginBottom: "2rem", padding: "1rem", border: "1px solid #eee", borderRadius: 6, background: "#fafbfc" }}>
            {event.image && (
              <Image
                src={event.image}
                alt={event.title}
                style={{ objectFit: "cover", borderRadius: 6, marginRight: "1.25rem", flexShrink: 0 }}
                width={140}
                height={100}
              />
            )}
            <div style={{ flex: 1, textAlign: "left" }}>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", color: "#2d3748" }}>{event.title}</h3>
              <div style={{ fontSize: "0.95rem", color: "#4a5568", marginBottom: "0.5rem" }}>
                <strong>Date:</strong> {event.date}
              </div>
              <div style={{ fontSize: "0.95rem", color: "#4a5568", marginBottom: "0.5rem" }}>
                <strong>Location:</strong> {event.location}
              </div>
              <div style={{ fontSize: "0.95rem", color: "#4a5568", marginBottom: "0.75rem" }}>
                {event.description}
              </div>
              <Link
                href={`/happening/${event.id}`}
                style={{
                  display: "inline-block",
                  padding: "0.5rem 1rem",
                  background: "#3182ce",
                  color: "#fff",
                  borderRadius: 4,
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "background 0.2s"
                }}
              >
                View Details
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Events