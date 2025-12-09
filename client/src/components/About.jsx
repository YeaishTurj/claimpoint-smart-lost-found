import { Target, Users, Zap, Shield } from "lucide-react";

export function About() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To digitalize and automate the lost and found process, making item recovery faster, transparent, and reliable for everyone.",
      color: "blue",
    },
    {
      icon: Users,
      title: "Community Focused",
      description:
        "We believe in connecting people with their belongings and fostering trust between organizations and the public.",
      color: "purple",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "Leveraging AI and smart matching technology to provide intelligent solutions for item recovery.",
      color: "cyan",
    },
    {
      icon: Shield,
      title: "Security First",
      description:
        "Protecting sensitive data while maintaining transparency in the process of returning items to their rightful owners.",
      color: "green",
    },
  ];

  return (
    <section id="about" className="py-20 space-y-12">
      {/* About Header */}
      <div className="text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300">
          About Us
        </p>
        <h2 className="text-4xl font-bold text-white mb-4">
          ClaimPoint — Smart Lost & Found
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg">
          A comprehensive platform designed to revolutionize how organizations
          and individuals manage lost and found items.
        </p>
      </div>

      {/* What We Do */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-white">What We Do</h3>
          <p className="text-gray-400 text-lg">
            ClaimPoint is a web-based lost and found management system designed
            for organizations like railway stations, airports, hospitals,
            universities, and shopping malls.
          </p>
          <ul className="space-y-3">
            {[
              "Record and track found items with detailed information",
              "Allow users to report lost items and submit claims",
              "Use AI to automatically match lost and found items",
              "Provide a secure, transparent item return process",
              "Send notifications to potential owners when matches are found",
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-8 border border-white/10">
          <h4 className="text-2xl font-bold text-white mb-4">
            Who Can Use ClaimPoint?
          </h4>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h5 className="font-semibold text-blue-300 mb-2">
                Organizations
              </h5>
              <p className="text-sm text-gray-400">
                Railway stations, airports, bus terminals, hospitals,
                universities, shopping malls, and other public facilities.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h5 className="font-semibold text-cyan-300 mb-2">
                General Public
              </h5>
              <p className="text-sm text-gray-400">
                Anyone who has lost or found an item within these premises can
                use ClaimPoint to report, search, and claim items.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="mt-16">
        <h3 className="text-3xl font-bold text-white mb-8 text-center">
          Our Core Values
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl border border-${value.color}-500/20 bg-${value.color}-500/10 text-center`}
            >
              <value.icon
                className={`text-${value.color}-400 mx-auto mb-4`}
                size={40}
              />
              <h4 className="text-xl font-bold text-white mb-2">
                {value.title}
              </h4>
              <p className="text-sm text-gray-400">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The Problem We Solve */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 border border-white/10">
        <h3 className="text-2xl font-bold text-white mb-4">The Problem</h3>
        <p className="text-gray-400 mb-4">
          Traditional lost and found processes are manual, inefficient, and
          often frustrating:
        </p>
        <ul className="space-y-2">
          {[
            "Items are recorded manually and can be easily lost or misplaced",
            "No intelligent way to match lost reports with found items",
            "Owners have difficulty finding their items",
            "Staff spend excessive time on manual tracking and verification",
            "Information is scattered across different systems or paper records",
          ].map((problem, idx) => (
            <li key={idx} className="flex items-start gap-3 text-gray-300">
              <span className="text-red-400 font-bold flex-shrink-0">✕</span>
              {problem}
            </li>
          ))}
        </ul>
      </div>

      {/* Our Solution */}
      <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl p-8 border border-blue-500/20">
        <h3 className="text-2xl font-bold text-white mb-4">Our Solution</h3>
        <p className="text-gray-400 mb-4">
          ClaimPoint transforms the lost and found process with technology and
          intelligence:
        </p>
        <ul className="space-y-2">
          {[
            "Digital database ensures no items are lost or forgotten",
            "AI-powered matching algorithm intelligently connects lost and found items",
            "Users can easily search and claim items online",
            "Staff are notified of matches and can verify ownership efficiently",
            "Centralized, secure, and transparent tracking system",
          ].map((solution, idx) => (
            <li key={idx} className="flex items-start gap-3 text-gray-300">
              <span className="text-green-400 font-bold flex-shrink-0">✓</span>
              {solution}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
