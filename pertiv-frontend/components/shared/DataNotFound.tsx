/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import React from 'react';

interface Props {
  data: any[];
}
const DataNotFound = ({ data }: Props) => {
  return (
    data.length === 0 && (
      <div className="flex flex-col justify-center items-center">
        <div className="relative size-52 ">
          <Image
            src="/assets/DataNotFound.png"
            sizes="50vw"
            quality={100}
            fill
            alt="no data"
          />
        </div>
        <p>Data not found</p>
      </div>
    )
  );
};

export default DataNotFound;
