import { defer } from "@remix-run/node";
import { Await, Form, Link, useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@vercel/remix";
import { json } from "@vercel/remix";
import { Suspense } from "react";

export const headers = () => {
  return {
    "Cache-Control": "public, s-maxage=60",
  };
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  console.log("THIS", this);
  // if (!user) return redirect("/login");
  const time = new Date().toLocaleTimeString();
  console.log("LOADER");

  const fakeDelay = new Promise((resolve) => {
    setTimeout(() => {
      resolve("hello");
    }, 4500);
  });
  const deferredData = fakeDelay;
  return defer({ message: "Hello World!", time, deferredData });
  // return json({ message: "Hello World!", time });
};
export default function Hello() {
  // if (window !== undefined) {
  //   console.log("WINDOW");
  // }

  const { message, time, deferredData } = useLoaderData<typeof loader>();
  return (
    <div>
      Hello
      <div>{message}</div>
      <div>{time}</div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={deferredData}>{(data) => <div>{data}</div>}</Await>
      </Suspense>
    </div>
  );

  // const time = new Date().toLocaleTimeString();
  // const [name, setName] = useState("");
  // const data = useLoaderData<typeof loader>();
  // const serverTime = data.time;
  // return (
  //   <div className="text-4xl text-center font-bold border m-5">
  //     <Link to="/">Home</Link>
  //     <div className="text-h6">Client time: {time}L</div>
  //     <div className="text-h6">Server time: {serverTime}</div>
  //     <Form
  //       method="POST"
  //       className="flex flex-col items-center border m-5 p-5 rounded-md"
  //     >
  //       <label htmlFor="name" className="font-bold mb-2">
  //         Name
  //       </label>
  //       <input
  //         value={name}
  //         onChange={(e) => setName(e.target.value)}
  //         id="name"
  //         type="text"
  //         name="name"
  //         className="border m-2 p-2 rounded-md w-full"
  //       />
  //       <label htmlFor="email" className="font-bold mb-2">
  //         Email
  //       </label>
  //       <input
  //         id="email"
  //         type="email"
  //         name="email"
  //         className="border m-2 p-2 rounded-md w-full"
  //       />
  //       <button
  //         type="submit"
  //         className="border m-2 p-2 rounded-md bg-blue-500 text-white w-full"
  //       >
  //         Submit
  //       </button>
  //     </Form>
  //   </div>
  // );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();

  const name = body.get("name");
  const email = body.get("email");

  console.log(name, email);

  const data = await createContact({ name, email });

  return json({ success: true, data });
};

function createContact(arg0: {
  name: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
}) {
  throw new Error("Function not implemented.");
}
// export const loader = ({ request, params, context }: LoaderFunctionArgs) => {
//   const cookie = request.headers.get("Cookie");
//   console.log(params);
//   const url = new URL(request.url);

//   const query = url.searchParams.get("q");
//   const response = redirect("/hello");
//   const deferred = defer({ message: "Hello World!" });
//   console.log(deferred);
//   return { message: "Hello World!" };
//   // return json(
//   //   { message: "Hello World!" },
//   //   { headers: { "Set-Cookie": "foo=bar" } },
//   // );
// };
