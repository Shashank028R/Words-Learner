import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Courses = () => {
    // State for the list of days combined with user progress
    const [courseDays, setCourseDays] = useState([]);
    // State to hold the words for days that have been fetched and expanded
    const [wordsByDay, setWordsByDay] = useState({});
    // State to track which day is currently expanded
    const [expandedDay, setExpandedDay] = useState(null);
    // General loading state for the initial page load
    const [loading, setLoading] = useState(true);
    // Specific loading state for when fetching words for an expanding day
    const [loadingWordsForDay, setLoadingWordsForDay] = useState(null);

    const token = localStorage.getItem("token");

    // --- Data Fetching (No Changes Needed) ---
    useEffect(() => {
        const fetchCourseData = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const courseStructureRes = await fetch(`${import.meta.env.VITE_API_URL}/api/courses`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!courseStructureRes.ok) throw new Error("Failed to fetch course structure");
                const courseStructureData = await courseStructureRes.json();

                const userProgressRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/progress`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!userProgressRes.ok) throw new Error("Failed to fetch user progress");
                const userProgressData = await userProgressRes.json();
                
                const progressMap = new Map(
                    userProgressData.user.progress.map(p => [p.day, p])
                );

                const combinedData = courseStructureData.days.map(day => {
                    const progress = progressMap.get(day.day) || { wordsRead: [], completed: false };
                    return { ...day, ...progress };
                });

                setCourseDays(combinedData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [token]);

    // --- Event Handlers (No Changes Needed) ---
    const toggleDay = async (dayNum) => {
        const isOpening = expandedDay !== dayNum;
        setExpandedDay(isOpening ? dayNum : null);

        if (isOpening && !wordsByDay[dayNum]) {
            setLoadingWordsForDay(dayNum);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${dayNum}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`Failed to fetch words for day ${dayNum}`);
                const data = await res.json();
                setWordsByDay(prev => ({ ...prev, [dayNum]: data.words }));
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingWordsForDay(null);
            }
        }
    };

    const markWordRead = async (dayNum, wordObject) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/mark`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ day: dayNum, word: wordObject.word }),
            });
            if (!res.ok) throw new Error("Failed to mark word");
            const data = await res.json();

            setCourseDays(prev =>
                prev.map(d =>
                    d.day === dayNum ? { ...d, ...data.progress } : d
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p className="text-center mt-10 text-white">Loading Courses...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 pb-10 font-sans">
            <Navbar />
            <div className="max-w-4xl mx-auto pt-24 sm:pt-32 space-y-4 px-4">
                {courseDays.map((day) => (
                    <div key={day.day} className="w-full bg-white/10 backdrop-blur-lg p-4 rounded-2xl shadow-lg border border-white/20 transition-all duration-300">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleDay(day.day)}
                        >
                            <h2 className="text-xl font-bold text-white">
                                {day.label} - ({day.wordsRead?.length || 0}/{wordsByDay[day.day]?.length || 50}) {day.completed ? "✅" : ""}
                            </h2>
                            <span className="text-white text-2xl font-light">{expandedDay === day.day ? "−" : "+"}</span>
                        </div>

                        {expandedDay === day.day && (
                            <div className="mt-4 space-y-3">
                                {loadingWordsForDay === day.day && <p className="text-center text-white/80">Loading Words...</p>}
                                
                                {/* --- START: UPDATED RENDERING LOGIC --- */}
                                {wordsByDay[day.day]?.map((wordObj) => {
                                    const isRead = day.wordsRead?.includes(wordObj.word);
                                    return (
                                        <div
                                            key={wordObj.id} // Use stable ID for the key
                                            className={`p-3 rounded-xl bg-white/20 transition-transform duration-200 ${isRead
                                                    ? "opacity-60 line-through"
                                                    : "cursor-pointer hover:scale-[1.02] hover:bg-white/30"
                                                }`}
                                            onClick={() => !isRead && markWordRead(day.day, wordObj)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 text-sm font-bold text-blue-900 bg-white/70 rounded-full">
                                                    {wordObj.id}
                                                </span>
                                                <div className="flex-grow">
                                                    <p className="font-bold text-lg text-white">{wordObj.word}</p>
                                                    <p className="text-sm text-white/90">{wordObj.meaning}</p>
                                                    <p className="text-sm text-white/80">{wordObj.hindi}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* --- END: UPDATED RENDERING LOGIC --- */}

                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;