'use client';

import { BsBookmarkPlusFill, BsBookmarkPlus, BsBook } from "react-icons/bs";
import React, { useState } from "react";


const BookmarkButton = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div 
      onClick={() => setIsFavorited(!isFavorited)}
      className="relative hover:opacity-80 transition cursor-pointer"
    >
      <BsBookmarkPlus
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <BsBookmarkPlusFill
        size={24}
        className={
          isFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'
        }
      />
    </div>
   );
}
 
export default BookmarkButton;