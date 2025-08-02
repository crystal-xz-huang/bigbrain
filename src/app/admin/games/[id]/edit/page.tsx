import Form from '@/components/games/edit-form';
import { fetchGameById } from '@/lib/data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Game',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  // Read the game ID from the URL parameters
  const params = await props.params;
  const id = params.id;

  // If the invoice is not found, return a 404 page
  const game = await fetchGameById(id);
  if (!game) {
    notFound();
  }

  // Render the form with the fetched data (invoice and customers)
  return (
    <>
      <Form game={game} />
    </>
  );
}
