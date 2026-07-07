import Image from "next/image";

export default function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Content Compare</h1>
      <p>
        Easily compare content between different sources. Start by selecting a comparison from the menu.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <Image
          src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
          alt="Content Compare Illustration"
          width={400}
          height={300}
        />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h2>How it works</h2>
        <ol style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>Select two sources to compare.</li>
          <li>Review differences highlighted for easy analysis.</li>
          <li>Export or share your comparison results.</li>
        </ol>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h2>Features</h2>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>Side-by-side content comparison</li>
          <li>Visual difference highlighting</li>
          <li>Support for multiple formats</li>
          <li>Easy export options</li>
        </ul>
      </div>
    </div>
  );
}
