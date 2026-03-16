import { useState } from "react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactPage() {

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const submit = () => {

    if (!form.name || !form.email || !form.message) {
      alert("Please fill required fields");
      return;
    }

    alert("Message Sent!");
  };

  return (
    <div className="bg-gray-50 py-16">

      <div className="max-w-7xl mx-auto px-6">

        {/* HERO */}

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}

          <div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              We're Here <br /> To Help You
            </h1>

            <p className="text-gray-600 mb-8 max-w-md">
              Questions, bulk orders, returns or just a quick chat —
              our support team responds fast.
            </p>

            <div className="flex flex-col gap-4">

              <a
                href="tel:+919876543210"
                className="bg-white p-4 rounded-lg hover:text-orange-500 transition"
              >
                📞 +91 98765 43210
              </a>

              <a
                href="https://wa.me/919876543210"
                className="bg-white p-4 rounded-lg hover:text-orange-500 transition"
              >
                💬 WhatsApp Support
              </a>

              <a
                href="mailto:help@mallkabaap.in"
                className="bg-white p-4 rounded-lg hover:text-orange-500 transition"
              >
                ✉️ help@mallkabaap.in
              </a>

              <a
                href="#info"
                className="bg-white p-4 rounded-lg hover:text-orange-500 transition"
              >
                📍 Lal Bazar, Kolkata
              </a>

            </div>

          </div>

          {/* RIGHT FORM */}

          <div className="bg-white p-10 rounded-xl shadow-lg">

            <h2 className="text-2xl font-bold mb-6">
              Send us a message
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                className="border p-3 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Your name"
                value={form.name}
                onChange={e => handleChange("name", e.target.value)}
              />

              <input
                className="border p-3 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Email"
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
              />

            </div>

            <input
              className="border p-3 rounded-lg mt-4 w-full focus:outline-none focus:border-orange-500"
              placeholder="Phone"
              value={form.phone}
              onChange={e => handleChange("phone", e.target.value)}
            />

            <textarea
              className="border p-3 rounded-lg mt-4 w-full min-h-[120px] focus:outline-none focus:border-orange-500"
              placeholder="Your message"
              value={form.message}
              onChange={e => handleChange("message", e.target.value)}
            />

            <button
              onClick={submit}
              className="bg-orange-500 text-white w-full mt-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Send Message
            </button>

          </div>

        </div>

        {/* INFO SECTION */}

        <div
          id="info"
          className="grid md:grid-cols-2 mt-16 rounded-xl overflow-hidden"
        >

          {/* GOOGLE MAP */}

          <div className="w-full h-[400px]">

            <iframe
              src="https://www.google.com/maps?q=Lal%20Bazar%20Kolkata&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

          </div>

          {/* BUSINESS HOURS */}

          <div className="bg-black text-white p-10">

            <h3 className="text-xl font-semibold mb-6">
              Business Hours
            </h3>

            <div className="flex justify-between py-2 border-b border-gray-700">
              <span>Monday – Friday</span>
              <span>10 AM – 9 PM</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-700">
              <span>Saturday</span>
              <span>10 AM – 10 PM</span>
            </div>

            <div className="flex justify-between py-2">
              <span>Sunday</span>
              <span>11 AM – 8 PM</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}