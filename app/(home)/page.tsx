import Link from 'next/link';

// Temporary landing page until the real home page is built.
export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <h1 className="text-2xl font-bold mb-4">Nanda Febian</h1>
      <p>
        <Link href="/projects/work-order-management" className="font-medium underline">
          View sample project
        </Link>
      </p>
    </div>
  );
}
