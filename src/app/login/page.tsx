import { Suspense } from "react";
import LoginForm from "@/app/ui/login-form";

function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

export default page;
