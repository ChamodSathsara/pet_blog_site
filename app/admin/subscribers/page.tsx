import { desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { subscribers } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export default async function SubscribersPage() {
  const subscriberList = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Subscribers</h1>
          <p className="mt-2 text-muted-foreground">People who signed up for the Housewise Journal newsletter.</p>
        </div>
        <div className="rounded-full bg-secondary px-4 py-2 text-sm font-medium">
          {subscriberList.length} {subscriberList.length === 1 ? 'subscriber' : 'subscribers'}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        {subscriberList.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Email address</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subscriberList.map((subscriber) => (
                  <tr key={subscriber.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">
                      <a className="break-all text-primary hover:underline" href={`mailto:${subscriber.email}`}>
                        {subscriber.email}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {dateFormatter.format(subscriber.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <h2 className="font-serif text-xl font-semibold">No subscribers yet</h2>
            <p className="mt-2 text-muted-foreground">New newsletter sign-ups will appear here.</p>
          </div>
        )}
      </div>
    </>
  );
}
