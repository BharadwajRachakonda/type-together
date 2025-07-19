import { signOutUser } from "../lib/action";
import { auth } from "@/auth";
import { authConfig } from "@/auth.config";

export default async function Page() {
  const session = await auth();
  if (!session || !session.user) return <div>Not signed in</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div>Welcome {session.user.email}</div>
      <form action={signOutUser}>
        <button
          type="submit"
          className="cursor-pointer border-2 border-gray-100/15 hover:border-gray-100/30 transition-all duration-300 ease-in-out px-4 py-2 rounded-xl"
        >
          signout
        </button>
      </form>
    </div>
  );
}
