"use client";
import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';
import StarRating from "./StarRating";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from '@/components/ui/Button';
import useAuth from '@/hooks/useAuth';
import { submitFeedback } from '@/api/actions/feedback';
import { toast } from 'sonner';

// Custom Textarea Component
function Textarea({ name, value, onChange, placeholder, label, error, maxLength = 500 }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-white-90">
          {label} <span className="text-red-500">*</span>
        </label>
        <span className="text-xs text-gray-40">
          {value.length}/{maxLength}
        </span>
      </div>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={5}
        className="bg-gray-15 border border-gray-20 text-white-90 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-60 focus:ring-1 focus:ring-purple-60 transition-all resize-none"
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}

// Main Feedback Form Component
export default function FeedbackForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    rating: 5,
    category: 'general',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isPending, setIsPending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (formData.rating === 0) newErrors.rating = 'Please select a rating';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    setIsPending(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('userId', user?.uid);
      formDataObj.append('name', formData.name);
      formDataObj.append('email', formData.email);
      formDataObj.append('category', formData.category);
      formDataObj.append('message', formData.message);
      formDataObj.append('rating', formData.rating);

      // Call server action
      const result = await submitFeedback(formDataObj);
      
      if (result.success) {
        toast.success('Thank you! Your feedback has been submitted successfully.')
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            rating: 5,
            category: 'general',
            message: '',
          });
        }, 3000);
      } else {
        toast.error('Oops! Something went wrong. Please try again.')
      }
    } catch (error) {
      toast.error(error)
    } finally {
      setIsPending(false);
    }
  };

  const categoryOptions = [
    { value: 'general', label: '💬 General Feedback' },
    { value: 'bug', label: '🐛 Bug Report' },
    { value: 'feature', label: '✨ Feature Request' },
  ];

  return (
    <div className="min-h-screen bg-gray-08 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-10 border border-gray-20 rounded-2xl p-6 md:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white-99">
              Feedback
            </h1>
            <p className="text-white-90">We'd love to hear your thoughts</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <Input
              name="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              label="Name"
              error={errors.name}
            />

            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              label="Email"
              error={errors.email}
            />

            <StarRating
              name="rating"
              value={formData.rating}
              onChange={(val) => setFormData({ ...formData, rating: val })}
              error={errors.rating}
            />

            <Select
              name="category"
              value={formData.category}
              onChange={(val) => setFormData({ ...formData, category: val })}
              options={categoryOptions}
              label="Category"
              error={errors.category}
            />

            <Textarea
              name="message"
              value={formData.message}
              onChange={(val) => setFormData({ ...formData, message: val })}
              placeholder="Tell us what's on your mind..."
              label="Message"
              error={errors.message}
              maxLength={500}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full bg-purple-60 hover:bg-purple-65 disabled:bg-gray-30 disabled:cursor-not-allowed text-white-99 font-semibold rounded-lg px-6 py-3 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white-99 border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Feedback
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}