// import { Link, useLoaderData } from "@remix-run/react";
// import { json } from "@vercel/remix";

// export const loader = async () => {
//   const visitorCount = await getNumberOfVisitor();
//   const numberOfNotesCreated = await getNumberOfNotesCreated();
//   return json({ visitorCount, numberOfNotesCreated });
// };

// export default function AboutPage() {
//   const data = useLoaderData<typeof loader>();
//   return (
//     <div className="text-center space-y-3">
//       <h1 className="text-3xl font-bold">About</h1>
//       <p className="text-xl">
//         This is an example app that uses Remix as a full-stack framework.
//       </p>
//       <p className="text-xl">
//         This website has been visited {data.visitorCount} times.
//       </p>

//       <p className="text-xl">
//         {data.numberOfNotesCreated} notes have been created till now.
//       </p>

//       <Link to="/">Home</Link>
//     </div>
//   );
// }

import { defer } from "@remix-run/node";
import { Await, Link, useLoaderData } from "@remix-run/react";

import { Suspense } from "react";

export const loader = async () => {
  const numberOfNotesCreated = getNumberOfNotesCreated();
  const visitorCount = await getNumberOfVisitor();
  return defer({ visitorCount, numberOfNotesCreated });
};

export default function AboutPage() {
  const { visitorCount, numberOfNotesCreated } = useLoaderData<typeof loader>();
  console.log(numberOfNotesCreated);
  return (
    <div className="text-center space-y-3">
      <h1 className="text-3xl font-bold">About</h1>
      <p className="text-xl">
        This is an example app that uses Remix as a full-stack framework.
      </p>
      <p className="text-xl">
        This website has been visited {visitorCount} times.
      </p>

      <Suspense>
        <Await
          resolve={numberOfNotesCreated}
          errorElement={<div>Something went wrong</div>}
        >
          {(numberOfNotesCreated) => (
            <p className="text-xl">
              {numberOfNotesCreated} notes have been created till now.
            </p>
          )}
        </Await>
      </Suspense>

      <Link to="/">Home</Link>
    </div>
  );
}
async function getNumberOfVisitor() {
  await sleep(300);
  return Math.floor(Math.random() * 1000);
}

async function getNumberOfNotesCreated() {
  await sleep(3000);
  return Math.floor(Math.random() * 10000);
}

export async function sleep(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
