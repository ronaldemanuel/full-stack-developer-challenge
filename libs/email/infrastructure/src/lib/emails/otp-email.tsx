import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  render,
  Tailwind,
  Text,
} from '@react-email/components';

interface OTPEmailProps {
  otp: string;
}

export const OTPEmail = ({ otp }: OTPEmailProps) => {
  const previewText = `Your OTP code`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Your OTP Code
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Your OTP is: {otp}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export async function renderOTPEmail(props: OTPEmailProps) {
  const component = <OTPEmail {...props} />;
  const [html, text] = await Promise.all([
    render(component),
    render(component, {
      plainText: true,
    }),
  ]);
  return {
    html,
    text,
  };
}
