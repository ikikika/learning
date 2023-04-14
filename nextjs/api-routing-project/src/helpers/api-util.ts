import { EventType } from "@/types/event.type";

export async function getAllEvents(): Promise<EventType[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`);
  const data = await response.json();

  // const events = [];

  // for (const key in data) {
  //   events.push({
  //     id: key,
  //     ...data[key],
  //   });
  // }

  return data.events;
}

export async function getFeaturedEvents(): Promise<EventType[]> {
  const allEvents = await getAllEvents();
  return allEvents.filter((event) => event.isFeatured);
}

export async function getEventById(id: string | number) {
  const allEvents = await getAllEvents();
  return allEvents.find((event) => event._id === id);
}

export async function getFilteredEvents(dateFilter: {
  year: number;
  month: number;
}) {
  const { year, month } = dateFilter;

  const allEvents = await getAllEvents();

  let filteredEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === year && eventDate.getMonth() === month - 1
    );
  });

  return filteredEvents;
}
