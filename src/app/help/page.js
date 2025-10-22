"use client";
import React, { useState, useMemo } from 'react';
import { HelpCircle, Mail, ChevronRight, Phone, X, Search, Zap, Shield } from 'lucide-react';
import { FAQS, HelpCategories, supportSections } from '@/lib/constants';

const HelpSupport = () => {
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [contactModal, setContactModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFAQs = useMemo(() => {
    let filtered = FAQS;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedCategory, searchQuery]);

  const ContactModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-gray-10 border border-gray-15 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white-99">Contact Support</h3>
          <button 
            onClick={() => setContactModal(false)}
            className="text-gray-40 hover:text-white-99 transition-colors p-2 hover:bg-gray-15 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-3">
          <a 
            href="mailto:paragbhosale06@gmail.com"
            className="flex items-start p-4 bg-gray-08 rounded-xl border border-gray-15 hover:border-purple-60 transition-all cursor-pointer group"
          >
            <div className="bg-purple-60/10 p-3 rounded-lg group-hover:bg-purple-60/20 transition-colors">
              <Mail className="text-purple-60" size={24} />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-white-99 font-semibold mb-1">Email Support</h4>
              <p className="text-gray-60 text-sm mb-1">paragbhosale06@gmail.com</p>
              <p className="text-gray-50 text-xs flex items-center gap-1">
                <Zap size={12} className="text-purple-60" />
                Response within 24 hours
              </p>
            </div>
          </a>
          
          <a 
            href="tel:+919356289160"
            className="flex items-start p-4 bg-gray-08 rounded-xl border border-gray-15 hover:border-purple-60 transition-all cursor-pointer group"
          >
            <div className="bg-purple-60/10 p-3 rounded-lg group-hover:bg-purple-60/20 transition-colors">
              <Phone className="text-purple-60" size={24} />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-white-99 font-semibold mb-1">Phone Support</h4>
              <p className="text-gray-60 text-sm mb-1">+91 9356289160</p>
              <p className="text-gray-50 text-xs flex items-center gap-1">
                <Shield size={12} className="text-green-500" />
                Available 24/7
              </p>
            </div>
          </a>
        </div>

        <div className="mt-6 p-4 bg-purple-60/5 border border-purple-60/20 rounded-xl">
          <p className="text-gray-60 text-sm text-center">
            Our support team typically responds within 2-4 hours during business hours
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-08 text-white-99">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-60/10 rounded-2xl mb-6">
            <HelpCircle className="text-purple-60" size={40} />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white-99 to-gray-60 bg-clip-text text-transparent">
            Help & Support Center
          </h1>
          <p className="text-gray-60 text-lg max-w-2xl mx-auto">
            Get answers to your questions and learn how to make the most of your coding journey
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-50" size={20} />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-10 border border-gray-15 rounded-xl text-white-99 placeholder-gray-50 focus:outline-none focus:border-purple-60 transition-colors"
            />
          </div>
        </div>

        {/* Quick Support Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {supportSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={section.action}
                className="bg-gray-10 border border-gray-15 rounded-xl p-6 cursor-pointer hover:border-purple-60 transition-all duration-200 hover:shadow-lg hover:shadow-purple-60/10 group text-left"
              >
                <div className="bg-purple-60/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-60 transition-colors">
                  <IconComponent size={24} className="text-purple-60 group-hover:text-white-99 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white-99">{section.title}</h3>
                <p className="text-gray-60 text-sm">{section.description}</p>
              </button>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-10 border border-gray-15 rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-white-99">Frequently Asked Questions</h2>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {HelpCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-purple-60 text-white-99 shadow-lg shadow-purple-60/20'
                      : 'bg-gray-08 text-gray-60 hover:text-white-99 border border-gray-15 hover:border-gray-20'
                  }`}
                >
                  <IconComponent size={18} />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <div key={faq.id} className="border border-gray-15 rounded-xl overflow-hidden bg-gray-08">
                  <button
                    onClick={() => setSelectedFAQ(selectedFAQ === faq.id ? null : faq.id)}
                    className="w-full text-left p-5 hover:bg-gray-15 transition-colors flex items-center justify-between"
                  >
                    <span className="font-semibold text-lg text-white-99 pr-4">{faq.question}</span>
                    <ChevronRight 
                      size={24} 
                      className={`text-gray-50 transition-transform flex-shrink-0 ${
                        selectedFAQ === faq.id ? 'rotate-90 text-purple-60' : ''
                      }`} 
                    />
                  </button>
                  {selectedFAQ === faq.id && (
                    <div className="px-5 pb-5 border-t border-gray-15">
                      <p className="text-gray-60 leading-relaxed pt-4">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Search className="mx-auto mb-4 text-gray-50" size={48} />
                <p className="text-gray-60 text-lg">No questions found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4 px-6 py-2 bg-purple-60 text-white-99 rounded-lg hover:bg-purple-70 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Still Need Help Section */}
        <div className="bg-gradient-to-r from-purple-60/10 to-purple-70/10 border border-purple-60/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3 text-white-99">Still need help?</h3>
          <p className="text-gray-60 mb-6 max-w-xl mx-auto">
            Our support team is available 24/7 to assist you with any questions or issues
          </p>
          <button 
            onClick={() => setContactModal(true)}
            className="px-8 py-3 bg-purple-60 text-white-99 rounded-xl font-semibold hover:bg-purple-70 transition-colors shadow-lg shadow-purple-60/20"
          >
            Contact Support Team
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      {contactModal && <ContactModal />}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HelpSupport;