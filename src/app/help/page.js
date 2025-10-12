"use client";
import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Bug, Mail, ChevronRight, Phone, Send, X } from 'lucide-react';
import { FAQS } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Dialog';
import { useRouter } from 'next/navigation';
import { SoundButton } from '@/components/ui/SoundButton';

const HelpSupport = () => {
  const router = useRouter();
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [contactModal, setContactModal] = useState(false);

  const supportSections = [
    {
      id: 'faqs',
      title: 'Frequently Asked Questions',
      description: 'Find quick answers to common questions',
      icon: HelpCircle,
      action: () => document.getElementById('faq-section').scrollIntoView({ behavior: 'smooth' })
    },
    {
      id: 'contact',
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageSquare,
      action: () => setContactModal(true)
    },
    {
      id: 'bug',
      title: 'Report a Bug',
      description: 'Help us improve by reporting issues',
      icon: Bug,
      action: () => router.push('/feedback')
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      description: 'Share your thoughts and suggestions',
      icon: Mail,
      action: () => router.push('/feedback')
    }
  ];

  const ContactModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-08 border border-gray-15 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Contact Support</h3>
          <SoundButton 
            onClick={() => setContactModal(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </SoundButton>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-08 rounded-lg border border-gray-15 hover:border-gray-30 transition-colors cursor-pointer">
            <Mail className="text-purple-400 mr-3" size={20} />
            <div>
              <h4 className="text-white font-medium">Email Support</h4>
              <p className="text-gray-300 text-sm">paragbhosale06@gmail.com</p>
              <p className="text-gray-400 text-xs">Response within 24 hours</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-08 rounded-lg border border-gray-15 hover:border-gray-30 transition-colors cursor-pointer">
            <Phone className="text-purple-400 mr-3" size={20} />
            <div>
              <h4 className="text-white font-medium">Phone Support</h4>
              <p className="text-gray-300 text-sm">+91 9356289160</p>
              <p className="text-gray-400 text-xs">Available 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Help & Support</h1>
          <p className="text-gray-300 text-lg">Get the help you need to make the most of your experience</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {supportSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <div
                key={section.id}
                onClick={section.action}
                className="bg-gray-08 border border-gray-15 rounded-xl p-6 cursor-pointer hover:border-gray-30 transition-all duration-200 hover:shadow-lg hover:shadow-gray-30/10 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-15 p-3 rounded-lg group-hover:bg-purple-600 transition-colors">
                      <IconComponent size={28} className="text-purple-400 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                      <p className="text-gray-300">{section.description}</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div id="faq-section" className="bg-gray-08 border border-gray-15 rounded-xl p-8">
          <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3">
            <HelpCircle className="text-purple-400" size={32} />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.id} className="border border-gray-15 rounded-lg overflow-hidden">
                <SoundButton
                  onClick={() => setSelectedFAQ(selectedFAQ === faq.id ? null : faq.id)}
                  className="w-full text-left p-5 bg-gray-15 hover:bg-gray-600 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-lg">{faq.question}</span>
                  <ChevronRight 
                    size={24} 
                    className={`text-gray-400 transition-transform ${selectedFAQ === faq.id ? 'rotate-90' : ''}`} 
                  />
                </SoundButton>
                {selectedFAQ === faq.id && (
                  <div className="p-5 bg-gray-08 border-t border-gray-600">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-4 text-lg">Still need help?</p>
          <Button 
            onClick={() => setContactModal(true)}
            className="text-white px-8 py-3 text-lg font-medium"
          >
            Contact Support
          </Button>
        </div>
      </div>

      {/* Modals */}
      {contactModal && <ContactModal />}
    </div>
  );
};

export default HelpSupport;