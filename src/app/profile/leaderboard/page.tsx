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
      <div className="flex flex-col gap-3">
        {topUsers.map((user, index) => (
          <div
            key={index}
            className="glass bg-gray-900/65 flex items-center justify-center p-2 px-8"
          >
            <div>{index + 1}</div>
            <div className="w-32 font-medium text-center">{user.email}</div>
            <div className="w-16 font-extralight text-center">
              {user.avg_speed} WPM
            </div>
            <div className="w-14 font-extralight text-center">
              {user.avg_accuracy}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
