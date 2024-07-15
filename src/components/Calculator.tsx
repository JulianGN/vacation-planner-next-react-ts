"use client";
import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import useHolidays from "@/application/hooks/useHolidays";

const HolidayCalculator: React.FC = () => {
  const [holidays, setHolidays] = useState("");
  const { calculateBestDaysOff } = useHolidays();
  // const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bestDaysOff = await calculateBestDaysOff(
      holidays.split("\n").map((date) => date.trim())
    );
    sessionStorage.setItem("bestDaysOff", JSON.stringify(bestDaysOff));
    // navigate("/results");
  };

  return (
    <div>
      <h1>Encontrar os melhores períodos</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Dividir em quantos períodos:
          <input
            value={holidays}
            onChange={(e) => setHolidays(e.target.value)}
          />
        </label>
        <button type="submit">Quero férias</button>
      </form>
    </div>
  );
};

export default HolidayCalculator;
