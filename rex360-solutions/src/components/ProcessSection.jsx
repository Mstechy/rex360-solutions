import { ClipboardList, CreditCard, FileCheck, CheckCircle } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: ClipboardList,
    title: "Submit Application",
    description: "Fill out our simple online application form with your business details and required documents.",
  },
  {
    step: 2,
    icon: CreditCard,
    title: "Make Payment",
    description: "Pay the registration fee via bank transfer to our secure business account.",
  },
  {
    step: 3,
    icon: FileCheck,
    title: "We Process",
    description: "Our team submits your application to CAC and handles all the paperwork for you.",
  },
  {
    step: 4,
    icon: CheckCircle,
    title: "Receive Certificate",
    description: "Get your official CAC registration certificate and documents delivered to you.",
  },
];

export function ProcessSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Simple <span className="text-blue-600">4-Step</span> Process
          </h2>
          <p className="text-lg text-gray-600">
            Getting your business registered has never been easier.
            Follow these simple steps to get started.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              
              return (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6 mt-4 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                      <StepIcon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-blue-600 z-20">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
