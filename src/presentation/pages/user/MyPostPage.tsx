import React from 'react'
import Navbar from '../../components/user/Navbar'
import MyPosts from '../../components/user/MyPosts'
import Footer from '../../components/user/Footer'
import SavedQuotes from '../../components/user/SavedQuotes'


const MyPostPage: React.FC = () => {
  return (
    <>
      <Navbar />

      {/* Page Header */}
      <div className="bg-[#1a0c75] text-white py-10 px-6 text-center">
        <h1 className="text-3xl font-bold mb-2">My Quotes & Posts</h1>
        <p className="text-gray-300">Manage your posts and saved quotes in one place</p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-12 bg-[#1a0c75] px-4 sm:px-8 lg:px-20 py-12">
        
        {/* My Posts Section */}
        <section className="bg-[#2b1a8a] p-6 rounded-xl shadow-lg">
          <MyPosts />
        </section>

        {/* Saved Quotes Section */}
        <section className="bg-[#2b1a8a] p-6 rounded-xl shadow-lg">

          <SavedQuotes />
        </section>

      </div>

      <Footer />
    </>
  );
};


export default MyPostPage