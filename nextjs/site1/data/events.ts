const EventsData = [
  {
    id: "react-conference-2024",
    title: "React Conference 2024",
    date: "2024-09-15",
    location: "San Francisco, CA",
    description: "Join us for the annual React Conference where developers from around the world gather to share knowledge, network, and learn about the latest advancements in React and its ecosystem.",
    longDescription: "React Conference 2024 brings together developers, engineers, and enthusiasts from across the globe to discuss the latest trends, tools, and best practices in React. The event features keynote speakers, hands-on workshops, and networking opportunities, making it a must-attend for anyone working with React.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "typescript-summit",
    title: "TypeScript Summit",
    date: "2024-10-10",
    location: "New York, NY",
    description: "A gathering for TypeScript enthusiasts and professionals to discuss best practices, new features, and real-world applications of TypeScript in modern development.",
    longDescription: "TypeScript Summit is designed for developers who use or are interested in TypeScript. The summit covers advanced topics, new language features, and practical applications in large-scale projects. Attendees will benefit from expert talks, interactive sessions, and networking with fellow TypeScript users.",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "frontend-masters-meetup",
    title: "Frontend Masters Meetup",
    date: "2024-08-22",
    location: "Austin, TX",
    description: "Connect with frontend developers and learn about the latest tools, frameworks, and techniques for building robust web applications.",
    longDescription: "Frontend Masters Meetup is an event for web developers focused on frontend technologies. Participants will explore new frameworks, tools, and methodologies for building scalable and maintainable web applications. The meetup includes talks, demos, and opportunities to collaborate with other frontend professionals.",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "javascript-global",
    title: "JavaScript Global",
    date: "2024-11-05",
    location: "London, UK",
    description: "An international conference focused on JavaScript and its ecosystem, featuring talks from industry leaders and hands-on workshops.",
    longDescription: "JavaScript Global is a premier event for JavaScript developers worldwide. The conference features sessions on the latest JavaScript frameworks, libraries, and tools, as well as hands-on workshops led by industry experts. Attendees will gain insights into the future of JavaScript and connect with peers from around the world.",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "web-performance-workshop",
    title: "Web Performance Workshop",
    date: "2024-07-30",
    location: "Berlin, Germany",
    description: "A hands-on workshop dedicated to optimizing web performance, covering topics such as caching, lazy loading, and efficient rendering.",
    longDescription: "Web Performance Workshop is a practical event for developers looking to improve the speed and efficiency of their web applications. The workshop covers techniques for optimizing loading times, caching strategies, and rendering performance, with real-world examples and expert guidance.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cloud-devops-expo",
    title: "Cloud DevOps Expo",
    date: "2024-12-12",
    location: "Seattle, WA",
    description: "Explore the latest trends in cloud computing and DevOps, with sessions on automation, CI/CD, and scalable infrastructure.",
    longDescription: "Cloud DevOps Expo is an event for professionals working in cloud infrastructure and DevOps. The expo features sessions on automation, continuous integration and deployment, and building scalable systems. Attendees will learn from industry leaders and discover new tools and practices for modern cloud development.",
    image: "https://images.unsplash.com/photo-1465101178521-c1a4c8a0f8e2?auto=format&fit=crop&w=600&q=80"
  }
];

export default EventsData;

export interface EventType {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  longDescription: string;
  image: string;
}