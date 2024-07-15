"use client";
import React from "react";

const HolidayResult: React.FC = () => {
  const bestDaysOff = JSON.parse(sessionStorage.getItem("bestDaysOff") || "[]");

  return (
    <div>
      <h2>Best Days Off:</h2>
      <ul>
        {bestDaysOff.map((day: string, index: number) => (
          <li key={index}>{day}</li>
        ))}
      </ul>
    </div>
  );
};

export default HolidayResult;
