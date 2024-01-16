import { json } from "@vercel/remix";

export const loader = () => {
  const data = {
    message: "hello world",
  };
  return json(data);
};
