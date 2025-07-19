import { Suspense } from "react";
import SignupForm from "@/app/ui/signup-form";

function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}

export default page;
