const useHolidays = () => {
  const calculateBestDaysOff = async (
    holidays: string[]
  ): Promise<string[]> => {
    const response = await fetch("/api/holidays/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ holidays }),
    });
    const result = await response.json();
    return result.bestDaysOff;
  };

  return { calculateBestDaysOff };
};

export default useHolidays;
