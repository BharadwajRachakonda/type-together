import { signOutUser } from "../lib/action";
import { auth } from "@/auth";
import { get10Records, createData } from "../lib/data";
import LineChart from "./components/line";
import BarChart from "./components/bar";

export default async function Page() {
  const session = await auth();
  if (!session || !session.user) return <div>Not signed in</div>;
  // create_table();
  const records = await get10Records(session!.user!.email!);
  const chartData = await createData(records);
  return (
    <div className="force-overflow min-h-svh translate-y-40 md:translate-y-5">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl md:text-4xl font-bold">
          Welcome {session.user.email}
        </h1>
        <form action={signOutUser}>
          <button
            type="submit"
            className="cursor-pointer border-2 border-gray-100/15 hover:border-gray-100/30 transition-all duration-300 ease-in-out px-4 py-2 rounded-xl"
          >
            signout
          </button>
        </form>
        {/* <BarChart data={chartData} /> */}
        {chartData && <LineChart data={chartData} />}
        <table className="w-full text-center max-w-2xl border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="border border-gray-100/15 rounded-md">Date</th>
              <th className="border border-gray-100/15 rounded-md">
                Speed (km/h)
              </th>
              <th className="border border-gray-100/15 rounded-md">
                Accuracy (m)
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="border border-gray-100/15 rounded-md">
                  {record.created_at.toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="border border-gray-100/15 rounded-md">
                  {record.speed}
                </td>
                <td className="border border-gray-100/15 rounded-md">
                  {record.accuracy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
