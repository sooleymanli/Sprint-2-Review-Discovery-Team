import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { ChevronLeft, ChevronRight, Home, CheckCircle, AlertCircle, XCircle } from "lucide-react";

const slides = [
  { id: 0, title: "Title", component: TitleSlide },
  { id: 1, title: "Hypothesis Funnel", component: HypothesisFunnelSlide },
  { id: 2, title: "4 Hypotheses", component: FourHypothesesSlide },
  { id: 3, title: "Traffic Light", component: TrafficLightSlide },
  { id: 4, title: "Surgery (Green)", component: SurgeryLifeSlide },
  { id: 5, title: "Event-Based (Yellow)", component: EventBasedLifeSlide },
  { id: 6, title: "Hotel Wellness (Yellow)", component: HotelWellnessSlide },
  { id: 7, title: "Job-Loss (Red)", component: JobLossSlide },
  { id: 8, title: "Next Steps", component: NextStepsSlide },
  { id: 9, title: "Thanks", component: ThankYouSlide },
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const navigateToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    }
  };

  const nextSlide = () => navigateToSlide(currentSlide + 1);
  const prevSlide = () => navigateToSlide(currentSlide - 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentSlide]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const CurrentSlideComponent = slides[currentSlide].component;


  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      nextSlide();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.code === "Space") {
      e.preventDefault(); // sayfa aşağı kaymasın
      toggleFullscreen();
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [currentSlide]);


const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top navigation bar */}
        <div className="p-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateToSlide(0)}
              className="text-slate-300 hover:text-orange-400 hover:bg-slate-800"
            >
              <Home className="w-4 h-4" />
            </Button>
            <span className="text-slate-400 text-sm">Sprint I Review — Discovery Team</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-400 text-sm"
          >
            {currentSlide + 1} / {slides.length}
          </motion.div>
        </div>

        {/* Slide content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
              }}
              className="w-full max-w-6xl"
            >
              <CurrentSlideComponent />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div className="p-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <Button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              variant="outline"
              className="border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-orange-400 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {/* Slide indicators */}
            <div className="flex gap-2">
              {slides.map((slide, index) => (
                <motion.button
                  key={slide.id}
                  onClick={() => navigateToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? "bg-gradient-to-r from-orange-500 to-blue-500 w-8"
                      : "bg-slate-600 w-2 hover:bg-slate-500"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              variant="outline"
              className="border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-orange-400 disabled:opacity-30"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TitleSlide() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <h1 className="text-6xl mb-6 bg-gradient-to-r from-orange-400 via-orange-500 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(251,146,60,0.6)]">
          Sprint I Review
        </h1>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-3xl text-slate-200 mb-4 drop-shadow-lg">Discovery Team</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <p className="text-slate-400 drop-shadow-md">November 28, 2025</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-slate-400 text-sm drop-shadow-md"
      >
        Press → or click Next to begin
      </motion.div>
    </motion.div>
  );
}

function HypothesisFunnelSlide() {
  const stages = [
    { label: "Initial Hypotheses", count: 20, width: "100%", color: "from-slate-700 to-slate-600" },
    { label: "Shortlisted", count: 10, width: "50%", color: "from-orange-700 to-orange-600" },
    { label: "Selected", count: 4, width: "25%", color: "from-emerald-700 to-emerald-600" },
  ];

  const criteria = [
    { name: "Viability", percentage: 40, color: "from-emerald-600 to-emerald-700" },
    { name: "Desirability", percentage: 30, color: "from-blue-600 to-blue-700" },
    { name: "Contextuality", percentage: 20, color: "from-orange-600 to-orange-700" },
    { name: "Feasibility", percentage: 10, color: "from-amber-600 to-amber-700" },
  ];

  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <Badge variant="outline" className="border-orange-500 text-orange-400 shadow-lg">
            01
          </Badge>
          <span className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            The Way Discovery Works: Hypothesis Funnel
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Funnel */}
          <div className="space-y-8">
            {stages.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.2 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{ width: stage.width }}
                  className={`bg-gradient-to-r ${stage.color} p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white drop-shadow-md">{stage.label}</span>
                    <span className="text-2xl text-white drop-shadow-md">{stage.count}</span>
                  </div>
                </motion.div>
                {index < stages.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.4 + index * 0.2 }}
                    className="w-0.5 h-8 bg-gradient-to-b from-slate-500 to-transparent my-2"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Assessment Criteria Bar Chart */}
          <div>
            <motion.h3
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-200 mb-6 drop-shadow-md"
            >
              Hypotheses Assessment Criteria:
            </motion.h3>
            <div className="space-y-5">
              {criteria.map((criterion, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  whileHover={{ scale: 1.03, x: 5 }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-200 text-sm drop-shadow-sm">{criterion.name}</span>
                    {/* <span className="text-slate-300 drop-shadow-sm">{criterion.percentage}%</span> */}
                  </div>
                  <div className="relative h-10 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${criterion.percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.15, duration: 0.8, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${criterion.color} shadow-lg flex items-center justify-end pr-3`}
                    >
                      <span className="text-white text-sm drop-shadow-md">{criterion.percentage}%</span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FourHypothesesSlide() {
  const hypotheses = [
    { name: "Surgery Life Insurance", icon: "🏥" },
    { name: "Event-Based Life Insurance", icon: "🎫" },
    { name: "Hotel Wellness Life Insurance", icon: "🏨" },
    { name: "Job-Loss Due to Illness Life Insurance", icon: "💼" },
  ];

  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <Badge variant="outline" className="border-orange-500 text-orange-400 shadow-lg">
            02
          </Badge>
          <span className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            The 4 Selected Hypotheses
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {hypotheses.map((hypo, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.15, type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-8 rounded-lg border border-slate-700 cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-center">
                <div className="text-5xl mb-4">{hypo.icon}</div>
                <h3 className="text-slate-100 drop-shadow-md">{hypo.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TrafficLightSlide() {
  const statuses = [
    {
      status: "RED",
      color: "red",
      icon: XCircle,
      items: ["Job-Loss Due to Illness Life Insurance"],
      lightIndex: 0,
    },
    {
      status: "YELLOW",
      color: "amber",
      icon: AlertCircle,
      items: ["Event-Based Life Insurance", "Hotel Wellness Life Insurance"],
      lightIndex: 1,
    },
    {
      status: "GREEN",
      color: "emerald",
      icon: CheckCircle,
      items: ["Surgery Life Insurance"],
      lightIndex: 2,
    },
  ];

  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <Badge variant="outline" className="border-orange-500 text-orange-400 shadow-lg">
            03
          </Badge>
          <span className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            The 4 Selected Hypotheses as Traffic Light Status
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-8">
          {/* Traffic Light Visual */}
          <div className="flex-shrink-0">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="bg-slate-900/80 border-4 border-slate-700 rounded-3xl p-6 shadow-2xl"
              // style={{ width: "10px" }}
            >
              <div className="space-y-6">
                {/* Red Light */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-900 to-red-950 border-4 border-slate-800 shadow-inner" />
                  <motion.div
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-[0_0_30px_rgba(239,68,68,0.8)]"
                  />
                </motion.div>

                {/* Yellow Light */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-900 to-amber-950 border-4 border-slate-800 shadow-inner" />
                  <motion.div
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.7,
                    }}
                    className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-[0_0_30px_rgba(251,191,36,0.8)]"
                  />
                </motion.div>

                {/* Green Light */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-900 to-emerald-950 border-4 border-slate-800 shadow-inner" />
                  <motion.div
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.4,
                    }}
                    className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.8)]"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Status Cards */}
          <div className="flex-1 space-y-6">
            {statuses.map((status, index) => {
              const Icon = status.icon;
              return (
                <motion.div
                  key={status.status}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.2 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className={`bg-gradient-to-r from-${status.color}-950/60 to-${status.color}-900/30 border-l-4 border-${status.color}-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.2, type: "spring" }}
                    >
                      <Icon className={`w-8 h-8 text-${status.color}-400`} />
                    </motion.div>
                    <h3 className={`text-2xl text-${status.color}-200 drop-shadow-md`}>{status.status}</h3>
                  </div>
                  <ul className="space-y-2">
                    {status.items.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.2 + i * 0.1 }}
                        className="text-slate-100 flex items-center gap-2"
                      >
                        <span className={`w-2 h-2 bg-${status.color}-400 rounded-full`} />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SurgeryLifeSlide() {
  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <Badge variant="outline" className="border-emerald-500 text-emerald-400 shadow-lg">
            04
          </Badge>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
              Surgery Life Insurance
            </span>
            <Badge className="bg-emerald-600 hover:bg-emerald-700 shadow-md">GREEN</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-emerald-950/40 border-l-4 border-emerald-500 p-5 rounded-lg shadow-lg"
        >
          <h3 className="text-emerald-200 mb-3 drop-shadow-md">Hypothesis</h3>
          <p className="text-slate-100 leading-relaxed drop-shadow-sm">
            Hospitals want operation-based life insurance covering severe complications to reduce reputational and financial risk.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/50 p-5 rounded-lg shadow-lg"
        >
          <h3 className="text-blue-300 mb-3 drop-shadow-md">Actions (Sprint II)</h3>
          <ul className="space-y-2 text-slate-200 text-sm">
            {[
              "Caspian interviews (2x)",
              "Bakı Sağlamlıq interview completed",
              "Universal Hospital scheduled",
              "Uniklinika meeting pending",
              "Data request sent to hospitals",
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-emerald-950/40 border-l-4 border-emerald-500 p-5 rounded-lg shadow-lg"
        >
          <h3 className="text-emerald-200 mb-3 drop-shadow-md">What We Learned</h3>
          <ul className="space-y-2 text-slate-100 text-sm">
            {[
              "High demand from hospitals",
              "Concept validated by stakeholders",
              "Customized packages required per hospital and surgery category",
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </CardContent>
    </Card>
  );
}

function EventBasedLifeSlide() {
  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <Badge variant="outline" className="border-amber-500 text-amber-400 shadow-lg">
            05
          </Badge>
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-400" />
            <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
              Event-Based Life Insurance
            </span>
            <Badge className="bg-amber-600 hover:bg-amber-700 shadow-md">YELLOW</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-amber-950/40 border-l-4 border-amber-500 p-5 rounded-lg shadow-lg"
        >
          <h3 className="text-amber-200 mb-3 drop-shadow-md">Hypothesis</h3>
          <p className="text-slate-100 leading-relaxed drop-shadow-sm">
            Ticket buyers will opt into a micro-insurance add-on, and iTicket/organizers will support integration.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/50 p-5 rounded-lg shadow-lg"
        >
          <h3 className="text-blue-300 mb-3 drop-shadow-md">Actions (Sprint II)</h3>
          <ul className="space-y-2 text-slate-200 text-sm">
            {[
              "B2C CusDev questions prepared",
              "Conducted 9 interviews with ticket buyers",
              "Contacted iTicket for extra data request",
              "Fake-door test proposal submitted",
              "A/B pricing test planned",
              "Pushed iTicket to conduct fakedoor test",
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-amber-950/40 border-l-4 border-amber-500 p-5 rounded-lg shadow-lg"
        >
          <h3 className="text-amber-200 mb-3 drop-shadow-md">What We Learned</h3>
          <ul className="space-y-2 text-slate-100 text-sm">
            {[
              "Demand cannot be validated until iTicket confirms tests",
              "High dependency on iTicket commitment",
              "B2C interviews show partial interest <30% and this makes it hard to scale if it is provided as optional purchase.",
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </CardContent>
    </Card>
  );
}

function HotelWellnessSlide() {
  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <Badge variant="outline" className="border-amber-500 text-amber-400 shadow-lg">
            06
          </Badge>
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-400" />
            <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
              Hotel Wellness Life Insurance
            </span>
            <Badge className="bg-amber-600 hover:bg-amber-700 shadow-md">YELLOW</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-amber-950/40 border-l-4 border-amber-500 p-5 rounded-lg shadow-lg"
        >
          <h3 className="text-amber-200 mb-3 drop-shadow-md">Hypothesis</h3>
          <p className="text-slate-100 leading-relaxed drop-shadow-sm">
            Wellness hotel guests value additional safety, and hotels will accept a small default insurance fee.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/50 p-5 rounded-lg shadow-lg"
        >
          <h3 className="text-blue-300 mb-3 drop-shadow-md">Actions (Sprint II)</h3>
          <ul className="space-y-2 text-slate-200 text-sm">
            {[
              "TABIA interview completed",
              "Operational insights collected",
              "Waiting for final response on December 1",
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-amber-950/40 border-l-4 border-amber-500 p-5 rounded-lg shadow-lg"
        >
          <h3 className="text-amber-200 mb-3 drop-shadow-md">What We Learned</h3>
          <ul className="space-y-2 text-slate-100 text-sm">
            {[
              "Concept promising but slow decision pace",
              "Hotel industry requires longer decision cycles",
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </CardContent>
    </Card>
  );
}

function JobLossSlide() {
  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <Badge variant="outline" className="border-red-500 text-red-400 shadow-lg">
            07
          </Badge>
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-400" />
            <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent drop-shadow-lg">
              Job-Loss Due to Illness Life Insurance
            </span>
            <Badge className="bg-red-600 hover:bg-red-700 shadow-md">RED</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-red-950/40 border-l-4 border-red-500 p-5 rounded-lg shadow-lg"
        >
          <h3 className="text-red-200 mb-3 drop-shadow-md">Hypothesis</h3>
          <p className="text-slate-100 leading-relaxed drop-shadow-sm">
            Employers will purchase life insurance for employees who lose income due to illness.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/50 p-5 rounded-lg shadow-lg"
        >
          <h3 className="text-blue-300 mb-3 drop-shadow-md">Actions (Sprint II)</h3>
          <ul className="space-y-2 text-slate-200 text-sm">
            {[
              "Meeting with PASHA Holding HR",
              "Meeting with PASHA Life HR",
              "Feedback collected from key stakeholders",
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-red-950/40 border-l-4 border-red-500 p-5 rounded-lg shadow-lg"
        >
          <h3 className="text-red-200 mb-3 drop-shadow-md">What We Learned</h3>
          <ul className="space-y-2 text-slate-100 text-sm">
            {[
              "Weak employer interest in this product",
              "Hypothesis not validated",
              "Decision: Kill this hypothesis",
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </CardContent>
    </Card>
  );
}

function NextStepsSlide() {
  const sections = [
    {
      title: "Surgery Life Insurance",
      status: "GREEN",
      color: "emerald",
      icon: CheckCircle,
      steps: [
        "Collect statistical operation data from hospitals",
        "Organize underwriting + legal joint meeting",
        "Draft first version of coverage packages",
        "Schedule follow-up meetings with clinics",
        "New clinics interviews will be conducted"
      ],
    },
    {
      title: "Event-Based Life Insurance",
      status: "YELLOW",
      color: "amber",
      icon: AlertCircle,
      steps: [
        "Push iTicket again on Monday for:",
        "  – Fake-door test approval",
        "  – A/B pricing test",
        "  – Statistical data sharing",
        "Park hypothesis if no progress by end of Sprint III",
      ],
    },
    {
      title: "Hotel Wellness Life Insurance",
      status: "YELLOW",
      color: "amber",
      icon: AlertCircle,
      steps: [
        "Receive TABIA response on December 1",
        "Schedule second meeting with TABIA Ops/BD team",
        "Park hypothesis if no progress by end of Sprint III",
      ],
    },
    {
      title: "Job-Loss Due to Illness Life Insurance",
      status: "RED",
      color: "red",
      icon: XCircle,
      steps: ["Decided to kill this hypothesis"],
    },
  ];

  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <Badge variant="outline" className="border-orange-500 text-orange-400 shadow-lg">
            08
          </Badge>
          <span className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            Next Steps
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
        <motion.div
          key={index}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.15 }}
          whileHover={{ scale: 1.02, x: 5 }}
          className={`bg-gradient-to-r from-${section.color}-950/60 to-${section.color}-900/30 border-l-4 border-${section.color}-500 p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Icon className={`w-5 h-5 text-${section.color}-400`} />
            <h3 className={`text-${section.color}-200 drop-shadow-md`}>{section.title}</h3>
            <Badge className={`bg-${section.color}-600 hover:bg-${section.color}-700 shadow-md text-xs`}>
          {section.status}
            </Badge>
          </div>
          <ul className="space-y-2 text-sm text-slate-200">
            {section.steps.map((step, i) => (
          <motion.li
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.15 + i * 0.05 }}
            className="flex items-start gap-2"
          >
            <span className={`w-1.5 h-1.5 bg-${section.color}-400 rounded-full mt-1.5 flex-shrink-0`} />
            {step}
          </motion.li>
            ))}
          </ul>
        </motion.div>
          );
        })}

   
      </CardContent>
    </Card>
  );
}


function ThankYouSlide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-center py-24"
    >
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        className="text-7xl font-extrabold mb-6 bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(251,146,60,0.6)]"
      >
      <h1 className="text-6xl mb-6 bg-gradient-to-r from-orange-400 via-orange-500 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(251,146,60,0.6)]">
          Thanks
        </h1>
      </motion.h1>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xl text-slate-300"
      >
        Thank you for your time — Sprint I Review
      </motion.p>

   
    </motion.div>
  );
}