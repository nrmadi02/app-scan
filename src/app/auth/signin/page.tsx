import MobileLayout from "~/components/layout/mobile.layout";
import SuspenseLayout from "~/components/layout/suspense.layout";
import SignInContainer from "~/features/auth/signin/signin.container";

export default function SignInPage() {
  return (
    <MobileLayout>
      <SuspenseLayout>
        <SignInContainer />
      </SuspenseLayout>
    </MobileLayout>
  );
}
