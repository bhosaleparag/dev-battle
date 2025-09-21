"use client";

import { submitFeedback } from "@/api/actions/feedback";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Typography from "@/components/ui/Typography";
import { useAuthContext } from "@/context/AuthContext";
import Form from "next/form";
import { useActionState } from "react";
import StarRating from "./StarRating";

export default function FeedbackForm() {
  const { user } = useAuthContext();

  const [state, action, isPending] = useActionState(submitFeedback, {
    success: null,
    message: "",
  });

  return (
    <div className="itemCenter h-full">
      <Form
        action={action}
        className="flex flex-col gap-4 p-10 bg-gray-10 border border-gray-20 w-1/3 rounded-sm"
      >
        <div className="flex flex-col justify-center items-center">
          <Typography variant="h1">Feedback</Typography>
          <Typography variant="body">We’d love to hear your thoughts</Typography>
        </div>

        <Input
          name="name"
          type="text"
          placeholder="Your Name"
          defaultValue={user?.username || ""}
        />

        <Input
          name="email"
          type="email"
          placeholder="Your Email"
          defaultValue={user?.email || ""}
        />

        <StarRating name="rating" defaultValue={5} />

        <Select
          name="category"
          defaultValue="general"
          options={[
            { value: "bug", label: "Bug Report" },
            { value: "feature", label: "Feature Request" },
            { value: "general", label: "General Feedback" },
          ]}
        />

        <textarea
          name="message"
          placeholder="Enter your feedback..."
          className="border p-2 rounded min-h-[100px] border border-gray-15 focus:outline-none"
        />

        {/* Hidden userId (from Firebase) */}
        <input type="hidden" name="userId" value={user?.uid || "anonymous"} />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>

        {state?.message && (
          <Typography
            variant="body"
            className={`text-center text-sm ${
              state.success ? "text-green-500" : "text-red-500"
            }`}
          >
            {state.message}
          </Typography>
        )}
      </Form>
    </div>
  );
}