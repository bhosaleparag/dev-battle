'use client';

import Leaderboard from "./Leaderboard";

export default function Demo() {
  const data = [
    { id: 1, name: 'Alice', score: 980, avatar: '/alice.jpg' },
    { id: 2, name: 'Bob', score: 870 },
    { id: 3, name: 'Charlie', score: 820, avatar: '/charlie.jpg' },
    { id: 4, name: 'Dana', score: 790 },
    { id: 5, name: 'Eve', score: 760 },
  ];

  return <Leaderboard users={data} />;
}