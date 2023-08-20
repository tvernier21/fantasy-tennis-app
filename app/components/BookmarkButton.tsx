'use client';

import { BsBookmarkPlusFill, BsBookmarkPlus } from "react-icons/bs";
import React, { useState } from "react";

interface BookmarkButtonProps {
  saved?: boolean;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  saved
}) => {
  const [isFavorited, setIsFavorited] = useState(saved);

  return (
    <div 
      onClick={() => setIsFavorited(!isFavorited)}
      className="relative hover:opacity-80 transition cursor-pointer"
    >
      <BsBookmarkPlus
        size={29}
        className="fill-white absolute -top-[2px] -right-[2.2px]"
      />
      <BsBookmarkPlusFill
        size={24}
        className={`
          absolute -top-[0px] -right-[0px] transition
          ${isFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'}
        `}
      />
    </div>
   );
}
 
export default BookmarkButton;