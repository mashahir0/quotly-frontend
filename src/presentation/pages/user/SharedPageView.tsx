import React from "react";
import Navbar from "../../components/user/Navbar";
import SharedQuote from "../../components/common/SharedQuote";
import Footer from "../../components/user/Footer";
import { useParams } from "react-router-dom";
import { useGetSharedQuoteQuery } from "../../../data/api/postApi";

const SharedPageView: React.FC = () => {
  const { shareId } = useParams();
  const { data, isLoading, isError } = useGetSharedQuoteQuery(shareId!, { skip: !shareId });

  return (
    <>
      <Navbar />

      {/* Main Container */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a0c75] px-4">
        {isLoading ? (
          <p className="text-white text-lg">Loading...</p>
        ) : isError || !data ? (
          <p className="text-red-500 text-lg">Failed to load quote. Please try again.</p>
        ) : (
          <SharedQuote text={data.text}  likes={data.likes} dislikes={data.dislikes} />
        )}
      </div>

      <Footer />
    </>
  );
};

export default SharedPageView;
