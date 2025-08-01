import { getTop10UsersAndCurrentRank } from "@/app/lib/data";
import { auth } from "@/auth";
async function Page() {
  const session = await auth();
  if (!session?.user?.email) {
    return (
      <div className="flex flex-col justify-center items-center">
        Please log in to view the leaderboard.
      </div>
    );
  }
  const email = session.user.email;
  const { topUsers, currentUserRank } = await getTop10UsersAndCurrentRank(
    email
  );
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Your Rank: {currentUserRank}</h2>
      </div>
      <div className="flex flex-col">
        {topUsers.map((user, index) => (
          <div
            key={index}
            className="glass bg-sky-600/15 flex items-center justify-center gap-5 p-2 px-8"
          >
            <div>{index + 1}</div>
            <div>{user.email}</div>
            <div>{user.avg_speed} WPM</div>
            <div>{user.avg_accuracy}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
