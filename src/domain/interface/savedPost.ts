export type Post = {
    _id: string;
    userId: string; // or a full user object if needed
    text: string;
    likes: number;
    dislikes: number;
    // Add other fields as needed
  };
  

  export interface MostLikedPost {
    _id: string;
    text: string;
    likes: number;
    shareId: string;
    userId: {
      _id: string;
      name: string;
      photo?: string;
    };
  }
  