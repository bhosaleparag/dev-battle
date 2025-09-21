"use server";
import { client } from "@/lib/sanity";

export async function submitFeedback(prevState, formData) {
  try {
    const feedback = {
      _type: "feedback",
      userId: formData.get("userId") || "anonymous",
      name: formData.get("name"),
      email: formData.get("email"),
      category: formData.get("category"),
      message: formData.get("message"),
      rating: Number(formData.get("rating")) || 5,
      createdAt: new Date().toISOString(),
      status: "new",
    };
    await client.create(feedback);

    return { success: true, message: "Thanks for your feedback!" };
  } catch (err) {
    console.error("Error submitting feedback:", err);
    return { success: false, message: "Failed to submit feedback" };
  }
}
