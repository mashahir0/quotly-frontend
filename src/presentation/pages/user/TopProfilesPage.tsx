import React from 'react'
import Navbar from '../../components/user/Navbar'
import Scoreboard from '../../components/user/Scoreboard'
import Footer from '../../components/user/Footer'
import TopLikedPosts from '../../components/user/TopLikedPosts';

const TopProfilesPage: React.FC = () => {
    return (
      <>
      <Navbar />
    
      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-br from-[#1a0c75] via-[#201263] to-[#110745] text-white px-4 py-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-10 items-center">
          <Scoreboard />
          <TopLikedPosts />
        </div>
      </main>
    
      <Footer />
    </>
    
    );
  };
  
  export default TopProfilesPage;
  