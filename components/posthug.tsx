"use client";

import posthog from "posthog-js";

interface UserProps {
  user: {
    email: string;
    id: string;
    image: string;
    name: string;
    username: string;
    createdAt?: Date;
    firstName?: string;
    lastName?: string;
    planName?: string;
    sitesCreated: number;
    sites: any;
  };
}

export default function IdentifyUser({ user }: UserProps) {
  posthog.identify(
    user.id, // Replace 'distinct_id' with your user's unique identifier
    {
      email: user.email,
      created_at: user?.createdAt,

      // Recommended attributes
      first_name: user?.firstName,
      last_name: user?.lastName,
      plan_name: user?.planName,
    }, // optional: set additional person properties
  );

  return <div className="hidden"></div>;
}

export const triggerEvent = async (event: string, paylaod: object) => {
  posthog.capture(event, paylaod);
};
