/* eslint-disable @next/next/no-img-element */
import React from 'react';

export default function Punk({
  address,
  size,
}: {
  address: string;
  size: number;
}) {
  const part1 = address.substr(2, 20);
  const part2 = address.substr(22);

  const x = parseInt(part1, 16) % 100;
  const y = parseInt(part2, 16) % 100;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        overflow: 'hidden',
      }}
    >
      <img
        src="https://punkwallet.io/punks.png"
        style={{
          position: 'absolute',
          left: -size * x,
          top: -size * y,
          width: size * 100,
          height: size * 100,
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
