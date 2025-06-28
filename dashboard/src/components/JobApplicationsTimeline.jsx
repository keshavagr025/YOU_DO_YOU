import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Briefcase, 
  CheckCircle, 
  Clock3, 
  XCircle, 
  Send,
  ChevronRight,
  Building2,
  User,
  Star,
  Zap,
  Trophy,
  Target,
  Eye,
  EyeOff,
  Shuffle,
  Lock,
  Unlock,
  Gift,
  Sparkles
} from "lucide-react";

const PuzzleJobTimeline = () => {
  const [revealedCards, setRevealedCards] = useState(new Set([0])); // First card revealed by default
  const [collectedPoints, setCollectedPoints] = useState(0);
  const [clickStreak, setClickStreak] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [puzzleMode, setPuzzleMode] = useState(true);
  const [shuffled, setShuffled] = useState(false);
  const [completedPuzzles, setCompletedPuzzles] = useState(new Set());
  const [showStats, setShowStats] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Interview":
        return CheckCircle;
      case "Under Review":
        return Clock3;
      case "Rejected":
        return XCircle;
      case "Applied":
        return Send;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Interview":
        return {
          bg: "bg-emerald-100",
          border: "border-emerald-300",
          text: "text-emerald-700",
          dot: "bg-emerald-500",
          glow: "shadow-emerald-500/25"
        };
      case "Under Review":
        return {
          bg: "bg-amber-100",
          border: "border-amber-300",
          text: "text-amber-700",
          dot: "bg-amber-500",
          glow: "shadow-amber-500/25"
        };
      case "Rejected":
        return {
          bg: "bg-red-100",
          border: "border-red-300",
          text: "text-red-700",
          dot: "bg-red-500",
          glow: "shadow-red-500/25"
        };
      case "Applied":
        return {
          bg: "bg-blue-100",
          border: "border-blue-300",
          text: "text-blue-700",
          dot: "bg-blue-500",
          glow: "shadow-blue-500/25"
        };
      default:
        return {
          bg: "bg-gray-100",
          border: "border-gray-300",
          text: "text-gray-700",
          dot: "bg-gray-500",
          glow: "shadow-gray-500/25"
        };
    }
  };

  const [jobApplications, setJobApplications] = useState([
    {
      id: 1,
      company: "Google",
      role: "Frontend Developer",
      status: "Interview",
      timeAgo: "2 days ago",
      salary: "₹25-35 LPA",
      location: "Bangalore",
      logo: "🟡",
      points: 50,
      puzzle: "Click me to unlock next card!",
      secretCode: "GGL2024"
    },
    {
      id: 2,
      company: "Amazon",
      role: "Backend Engineer",
      status: "Under Review",
      timeAgo: "5 days ago",
      salary: "₹30-40 LPA",
      location: "Hyderabad",
      logo: "🟠",
      points: 30,
      puzzle: "Hover 3 times to reveal secret info",
      secretCode: "AMZ2024"
    },
    {
      id: 3,
      company: "Adobe",
      role: "UI/UX Designer",
      status: "Rejected",
      timeAgo: "1 week ago",
      salary: "₹20-28 LPA",
      location: "Noida",
      logo: "🔴",
      points: 20,
      puzzle: "Double-click to transform this card",
      secretCode: "ADB2024"
    },
    {
      id: 4,
      company: "Flipkart",
      role: "Full Stack Developer",
      status: "Applied",
      timeAgo: "3 days ago",
      salary: "₹18-25 LPA",
      location: "Bangalore",
      logo: "🔵",
      points: 40,
      puzzle: "Find the hidden treasure by clicking the logo 5 times",
      secretCode: "FLK2024"
    },
  ]);

  const [hoverCounts, setHoverCounts] = useState({});
  const [clickCounts, setClickCounts] = useState({});

  const revealCard = (index, points) => {
    if (!revealedCards.has(index)) {
      setRevealedCards(prev => new Set([...prev, index]));
      setCollectedPoints(prev => prev + points);
      setClickStreak(prev => prev + 1);
    }
  };

  const handleCardClick = (index, item) => {
    revealCard(index, item.points);
    
    // Special click interactions
    if (index === 0 && !revealedCards.has(1)) {
      setTimeout(() => revealCard(1, jobApplications[1].points), 500);
    }
  };

  const handleCardHover = (index) => {
    setHoverCounts(prev => ({
      ...prev,
      [index]: (prev[index] || 0) + 1
    }));

    // Reveal card after 3 hovers
    if (hoverCounts[index] === 2) {
      revealCard(index, jobApplications[index].points);
    }
  };

  const handleCardDoubleClick = (index) => {
    if (index === 2) {
      setCompletedPuzzles(prev => new Set([...prev, index]));
      revealCard(index, jobApplications[index].points * 2);
    }
  };

  const handleLogoClick = (index) => {
    setClickCounts(prev => ({
      ...prev,
      [index]: (prev[index] || 0) + 1
    }));

    if (clickCounts[index] === 4) { // 5th click (0-indexed)
      setShowSecret(true);
      setCollectedPoints(prev => prev + 100);
      setTimeout(() => setShowSecret(false), 3000);
    }
  };

  const shuffleCards = () => {
    const shuffledApps = [...jobApplications].sort(() => Math.random() - 0.5);
    setJobApplications(shuffledApps);
    setShuffled(true);
    setTimeout(() => setShuffled(false), 1000);
  };

  const togglePuzzleMode = () => {
    setPuzzleMode(!puzzleMode);
    if (!puzzleMode) {
      setRevealedCards(new Set([0, 1, 2, 3])); // Reveal all in normal mode
    } else {
      setRevealedCards(new Set([0])); // Hide all except first in puzzle mode
    }
  };

  useEffect(() => {
    if (clickStreak >= 3) {
      setShowStats(true);
      setTimeout(() => setShowStats(false), 2000);
      setClickStreak(0);
    }
  }, [clickStreak]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 transition-all duration-500 w-full hover:shadow-3xl group relative overflow-hidden"
    >
      {/* Mystical background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
      
      {/* Floating magical particles */}
      <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-bounce"></div>
      <div className="absolute top-8 right-12 w-2 h-2 bg-pink-400 rounded-full opacity-80 animate-ping"></div>
      <div className="absolute top-16 right-8 w-1 h-1 bg-blue-400 rounded-full opacity-40 animate-pulse"></div>
      
      {/* Header with puzzle controls */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between mb-8 relative z-10"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: puzzleMode ? [0, 10, 0] : 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg"
          >
            {puzzleMode ? <Target className="w-6 h-6 text-white" /> : <Briefcase className="w-6 h-6 text-white" />}
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              🧩 Mystery Job Quest
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              {puzzleMode ? "Solve puzzles to unlock applications!" : "All applications revealed"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Points display */}
          <motion.div 
            animate={{ scale: collectedPoints > 0 ? [1, 1.1, 1] : 1 }}
            className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-400/30"
          >
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-300 font-bold">
              {collectedPoints} pts
            </span>
          </motion.div>

          {/* Puzzle mode toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePuzzleMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              puzzleMode 
                ? 'bg-purple-500/20 border-purple-400/30 text-purple-300' 
                : 'bg-blue-500/20 border-blue-400/30 text-blue-300'
            }`}
          >
            {puzzleMode ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {puzzleMode ? 'Puzzle' : 'Normal'}
            </span>
          </motion.button>

          {/* Shuffle button */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={shuffleCards}
            className="flex items-center gap-2 bg-pink-500/20 px-4 py-2 rounded-full border border-pink-400/30 text-pink-300"
          >
            <Shuffle className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Secret achievement popup */}
      <AnimatePresence>
        {showSecret && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl shadow-2xl border-2 border-white"
          >
            <div className="text-center text-white">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <h4 className="text-lg font-bold">🎉 Secret Unlocked!</h4>
              <p className="text-sm">+100 Bonus Points!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats popup */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-20 right-8 z-40 bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-xl shadow-lg text-white"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="font-bold">Click Streak!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      <div className="relative z-10">
        {/* Mystical timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-pink-400 to-blue-400 opacity-50"></div>
        
        <div className="space-y-6">
          {jobApplications.map((item, index) => {
            const StatusIcon = getStatusIcon(item.status);
            const colors = getStatusColor(item.status);
            const isRevealed = revealedCards.has(index) || !puzzleMode;
            const isPuzzleCompleted = completedPuzzles.has(index);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  rotateY: shuffled ? 360 : 0
                }}
                transition={{ 
                  delay: 0.3 + index * 0.1,
                  rotateY: { duration: 1 }
                }}
                className="relative group/item"
              >
                {/* Magical timeline dot */}
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  className={`absolute left-4 w-4 h-4 ${
                    isRevealed ? colors.dot : 'bg-gray-500'
                  } rounded-full shadow-lg z-10 border-2 border-white ${
                    isRevealed ? colors.glow : ''
                  }`}
                >
                  <motion.div
                    animate={{ 
                      scale: isRevealed ? [1, 1.3, 1] : 1,
                      opacity: isRevealed ? [0.3, 0.7, 0.3] : 0.3
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    className={`absolute inset-0 ${
                      isRevealed ? colors.dot : 'bg-gray-500'
                    } rounded-full`}
                  ></motion.div>
                </motion.div>

                {/* Content card with puzzle mechanics */}
                <motion.div 
                  className={`ml-12 backdrop-blur-sm rounded-2xl p-6 shadow-lg border transition-all duration-300 cursor-pointer ${
                    isRevealed 
                      ? 'bg-white/90 border-white/50 hover:bg-white/95' 
                      : 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-700/60'
                  } ${isPuzzleCompleted ? 'ring-2 ring-yellow-400' : ''}`}
                  whileHover={{ y: isRevealed ? -2 : -1, scale: 1.02 }}
                  onClick={() => handleCardClick(index, item)}
                  onDoubleClick={() => handleCardDoubleClick(index)}
                  onMouseEnter={() => handleCardHover(index)}
                >
                  {/* Puzzle overlay for hidden cards */}
                  {!isRevealed && puzzleMode && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                    >
                      <div className="text-center text-white p-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 mx-auto mb-3"
                        >
                          🧩
                        </motion.div>
                        <p className="text-sm font-medium mb-2">Mystery Application</p>
                        <p className="text-xs text-gray-300">{item.puzzle}</p>
                        {hoverCounts[index] > 0 && (
                          <div className="mt-2">
                            <div className="flex justify-center gap-1">
                              {[...Array(3)].map((_, i) => (
                                <div 
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < (hoverCounts[index] || 0) ? 'bg-yellow-400' : 'bg-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Revealed content */}
                  <AnimatePresence>
                    {isRevealed && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        {/* Company and role */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <motion.div 
                              whileHover={{ scale: 1.1, rotate: 15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLogoClick(index);
                              }}
                              className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-xl shadow-sm cursor-pointer hover:shadow-md transition-all"
                            >
                              {item.logo}
                              {clickCounts[index] > 0 && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold"
                                >
                                  {clickCounts[index]}
                                </motion.div>
                              )}
                            </motion.div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-lg group-hover/item:text-blue-700 transition-colors">
                                {item.role}
                                {isPuzzleCompleted && (
                                  <Sparkles className="inline w-4 h-4 ml-2 text-yellow-500" />
                                )}
                              </h4>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Building2 className="w-4 h-4" />
                                <span className="font-medium">{item.company}</span>
                              </div>
                            </div>
                          </div>
                          
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-300 cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          </motion.div>
                        </div>

                        {/* Status badge with points */}
                        <div className="flex items-center gap-3 mb-4">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} ${colors.border} border`}
                          >
                            <StatusIcon className={`w-4 h-4 ${colors.text}`} />
                            <span className={`font-semibold text-sm ${colors.text}`}>
                              {item.status}
                            </span>
                          </motion.div>
                          
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300"
                          >
                            <Star className="w-3 h-3 text-yellow-600" />
                            <span className="text-xs font-bold text-yellow-700">
                              +{isPuzzleCompleted ? item.points * 2 : item.points}
                            </span>
                          </motion.div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>{item.timeAgo}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-green-700">{item.salary}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="w-4 h-4 text-purple-500" />
                            <span>{item.location}</span>
                          </div>
                        </div>

                        {/* Enhanced progress indicator */}
                        {(item.status === "Interview" || item.status === "Under Review") && (
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: item.status === "Interview" ? "75%" : "50%" }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className="mt-4 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
                          >
                            <motion.div
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enhanced footer with achievements */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 pt-6 border-t border-white/20 relative z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Cards Revealed", value: revealedCards.size, color: "text-blue-400", icon: Eye },
            { label: "Points Earned", value: collectedPoints, color: "text-yellow-400", icon: Star },
            { label: "Puzzles Solved", value: completedPuzzles.size, color: "text-purple-400", icon: Target },
            { label: "Secret Codes", value: "4/4", color: "text-green-400", icon: Gift },
            { label: "Achievement", value: revealedCards.size === 4 ? "Master" : "Explorer", color: "text-orange-400", icon: Trophy }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                className="text-center p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <IconComponent className={`w-4 h-4 ${stat.color}`} />
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                </div>
                <div className="text-xs text-gray-300">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Achievement progress bar */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(revealedCards.size / 4) * 100}%` }}
          className="mt-4 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full relative overflow-hidden"
        >
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>
        
        <p className="text-center text-xs text-gray-400 mt-2">
          {revealedCards.size === 4 ? "🎉 All mysteries solved! You are a true Job Quest Master!" : 
           `${4 - revealedCards.size} mysteries remaining...`}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PuzzleJobTimeline;