import { CheckCircle, Search, Users, Package } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Package,
      title: "Found an Item?",
      description:
        "Staff members can record found items with detailed information including images, location, and item type. This data is securely stored in our database.",
      color: "blue",
    },
    {
      icon: Search,
      title: "Smart Matching",
      description:
        "Our AI-based matching algorithm automatically compares found items with lost reports and user claims to find the best matches.",
      color: "purple",
    },
    {
      icon: Users,
      title: "User Claims",
      description:
        "Users can browse found items and submit claims with their own details. The system calculates match percentages to help verify ownership.",
      color: "cyan",
    },
    {
      icon: CheckCircle,
      title: "Verification & Return",
      description:
        "Once matched, users visit in person for final verification. Staff confirms ownership through physical proof before returning the item.",
      color: "green",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 space-y-12">
      <div className="text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300">
          How It Works
        </p>
        <h2 className="text-4xl font-bold text-white mb-4">
          The ClaimPoint Process
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg">
          We've made it simple and efficient to reunite people with their lost
          belongings through a smart, transparent workflow.
        </p>
      </div>

      {/* Steps Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Connection Line (hidden on last item) */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-transparent transform translate-x-1/2"></div>
            )}

            {/* Card */}
            <div
              className={`relative p-6 rounded-xl border border-${step.color}-500/20 bg-${step.color}-500/10 h-full`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Step Number */}
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full bg-${step.color}-500/20 border-2 border-${step.color}-500/50 text-${step.color}-300 font-bold text-lg`}
                >
                  {index + 1}
                </div>

                {/* Icon */}
                <step.icon className={`text-${step.color}-400`} size={32} />

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Features */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">
          Why Choose ClaimPoint?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Intelligent Matching",
              description:
                "AI-powered algorithm matches lost and found items automatically",
            },
            {
              title: "Secure Data",
              description:
                "Sensitive details are protected while public info is accessible",
            },
            {
              title: "Fast Recovery",
              description:
                "Streamlined process reduces time to reunite with your items",
            },
            {
              title: "Easy to Use",
              description:
                "Simple interface for both staff and public to report and claim items",
            },
            {
              title: "Transparent Process",
              description:
                "Track your claims and get notifications every step of the way",
            },
            {
              title: "Multiple Institutions",
              description:
                "Can be deployed across various organizations and facilities",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
