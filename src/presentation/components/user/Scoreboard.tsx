import { useEffect, useState } from "react";
import { useGetTopLikedProfilesQuery } from "../../../data/api/postApi";
import socket from "../../../utils/socket";

const Scoreboard = () => {
  const { data, isLoading } = useGetTopLikedProfilesQuery();
  const [topProfiles, setTopProfiles] = useState(data || []);

  useEffect(() => {
    socket.on("updateScoreboard", (updatedProfiles) => {
      setTopProfiles(updatedProfiles);
    });

    return () => {
      socket.off("updateScoreboard");
    };
  }, []);

  if (isLoading) return <p className="text-center text-white">Loading leaderboard...</p>;

  return (
    <div className="bg-white/10 text-white rounded-2xl shadow-lg p-6 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">🔥 Top Profiles</h2>

      {topProfiles.length === 0 ? (
        <p className="text-center text-gray-300">No top profiles yet.</p>
      ) : (
        <ul className="space-y-4">
          {topProfiles.map((profile: any, index: number) => (
            <li key={profile.userId} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg shadow">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                {profile.photo ? (
                  <img src={profile.photo} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-gray-500" />
                ) : (
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-gray-300 text-lg">{profile.name[0]}</span>
                  </div>
                )}
                <span className="text-lg font-semibold">{profile.name}</span>
              </div>
              <span className="text-green-400 font-bold">👍 {profile.totalLikes}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Scoreboard;
