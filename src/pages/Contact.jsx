import React from 'react';
import { motion } from 'framer-motion'; // npm install framer-motion (optional but recommended)
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon, 
  ClockIcon, 
  QuestionMarkCircleIcon,
  BookOpenIcon,
  CreditCardIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function Contact() {
  const contactInfo = {
    email: `${import.meta.env.VITE_CONTACT_EMAIL}`,
    responseTime: '24-48 hours',
    supportHours: 'Monday - Friday, 9:00 AM - 6:00 PM (IST)',
  };

  const queryCategories = [
    {
      icon: <BookOpenIcon className="w-6 h-6" />,
      title: 'PDF & Ebook Issues',
      description: 'Problems with reading, downloading, or accessing our PDF library?',
      emailSubject: 'PDF Issue'
    },
    {
      icon: <CreditCardIcon className="w-6 h-6" />,
      title: 'Subscription & Billing',
      description: 'Questions about plans, payments, or subscription status?',
      emailSubject: 'Subscription Query'
    },
    {
      icon: <DocumentTextIcon className="w-6 h-6" />,
      title: 'Article & Content',
      description: 'Feedback or issues related to articles in Health, Finance, etc.?',
      emailSubject: 'Article Feedback'
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      title: 'General Inquiry',
      description: 'Anything else? We\'d love to hear from you!',
      emailSubject: 'General Question'
    }
  ];

  // Function to generate mailto link
  const getMailtoLink = (subject) => {
    return `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Have questions about our PDF library, articles, or subscription? 
              We're here to help!
            </p>
          </motion.div>
        </div>
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100L1440 0V100H0Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Direct Email Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 mb-12 text-center max-w-3xl mx-auto"
        >
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <EnvelopeIcon className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Email Us Directly</h2>
          <p className="text-lg text-gray-600 mb-6">
            Send us an email at <span className="font-semibold text-blue-600">{contactInfo.email}</span>
          </p>
          <a
            href={`mailto:${contactInfo.email}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
          >
            <EnvelopeIcon className="w-5 h-5 mr-2" />
            Send Email
          </a>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>Response: {contactInfo.responseTime}</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center gap-1">
              <span>🕒</span>
              <span>{contactInfo.supportHours}</span>
            </div>
          </div>
        </motion.div>

        {/* Query Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What can we help you with?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {queryCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {category.description}
                    </p>
                    <a
                      href={getMailtoLink(category.emailSubject)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Email about this
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-gray-50 rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <QuestionMarkCircleIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Quick Help</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Before reaching out, check our FAQ section for instant answers to common questions.
          </p>
          <a
            href="/faq"
            className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition"
          >
            Browse FAQ
          </a>
        </motion.div>
      </div>
    </div>
  );
}