import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "support@claimpoint.com",
      href: "mailto:support@claimpoint.com",
      color: "blue",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+880 1537 151 211",
      href: "tel:+8801537151211",
      color: "purple",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "Dhaka, Bangladesh",
      href: "#",
      color: "cyan",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset submitted state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-20 space-y-12">
      {/* Header */}
      <div className="text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300">
          Get In Touch
        </p>
        <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg">
          Have questions about ClaimPoint? We're here to help. Get in touch with
          our team through any of the following methods.
        </p>
      </div>

      {/* Contact Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactInfo.map((info, idx) => (
          <a
            key={idx}
            href={info.href}
            className={`p-6 rounded-xl border border-${info.color}-500/20 bg-${info.color}-500/10 hover:bg-${info.color}-500/20 transition cursor-pointer group`}
          >
            <div className="flex items-start gap-4">
              <info.icon
                className={`text-${info.color}-400 flex-shrink-0 group-hover:scale-110 transition`}
                size={32}
              />
              <div>
                <h3 className="font-semibold text-white mb-2">{info.title}</h3>
                <p className="text-gray-400 text-sm hover:text-gray-300 transition">
                  {info.value}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Send Us a Message</h3>

          {submitted ? (
            <div className="p-6 rounded-lg border border-green-500/40 bg-green-500/10">
              <div className="flex items-start gap-3">
                <div className="text-green-400 text-2xl flex-shrink-0">✓</div>
                <div>
                  <h4 className="font-semibold text-green-300 mb-1">
                    Message Sent!
                  </h4>
                  <p className="text-sm text-green-200">
                    Thank you for reaching out. We'll get back to you as soon as
                    possible.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  rows="5"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* FAQ or Additional Info */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Frequently Asked</h3>

          <div className="space-y-4">
            {[
              {
                question: "How long does it take to process a claim?",
                answer:
                  "Once you submit a claim, our system analyzes it and notifies you within 24-48 hours. The final verification happens when you visit in person.",
              },
              {
                question: "Is my personal information secure?",
                answer:
                  "Yes, we use industry-standard encryption and data protection measures. Sensitive details are only visible to authorized staff.",
              },
              {
                question: "Can I report an item lost after months?",
                answer:
                  "Yes, you can report lost items at any time. Our system will match them against all found items in the database.",
              },
              {
                question: "What if multiple people claim the same item?",
                answer:
                  "Our matching algorithm ranks claimants by match percentage. Staff reviews all claims and verifies ownership through physical proof.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
              >
                <h4 className="font-semibold text-white mb-2">
                  {faq.question}
                </h4>
                <p className="text-sm text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Support Hours */}
          <div className="p-6 rounded-lg border border-blue-500/20 bg-blue-500/10">
            <h4 className="font-semibold text-white mb-3">Support Hours</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span className="text-blue-300">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span className="text-blue-300">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-gray-600">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
