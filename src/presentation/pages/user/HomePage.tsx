

import AddPost from "../../components/user/AddPost";
import Navbar from "../../components/user/Navbar";
import UserProfile from "../../components/user/UserProfile";
import PostsList from "../../components/user/PostsList";
import Footer from "../../components/user/Footer";

function HomePage() {
  return (
    <>
      <Navbar />

      {/* Profile and Add Post Section */}
      <div className="flex flex-col md:flex-col lg:flex-row justify-center items-center p-6 bg-[#1a0c75] gap-6">
        {/* Profile (Top on Mobile, Right on Desktop/13-inch Monitor) */}
        <div className="w-full lg:w-1/3 flex justify-center lg:order-2">
          <UserProfile />
        </div>

        {/* Add Post (Below Profile on Mobile, Left on Desktop/13-inch Monitor) */}
        <div className="w-full lg:w-1/3 flex justify-center lg:order-1">
          <AddPost />
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-6 flex justify-center p-6 bg-[#1a0c75]">
        <div className="w-full md:w-3/3">
          <PostsList />
        </div>
      </div>

      <Footer/>
    </>
  );
}

export default HomePage;
