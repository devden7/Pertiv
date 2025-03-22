import PaymentContent from '@/components/user/PaymentContent';
import { getUserToken } from '@/lib/actions/auth.action';
import { paymentOrderDetail } from '@/lib/actions/user.action';

interface Params {
  params: { id: string };
}
const Payment = async ({ params }: Params) => {
  const user = await getUserToken();
  if (!user) {
    return;
  }

  const response = await paymentOrderDetail(`${params.id}`, user.token);
  if (!response.success) {
    return <p>Not Found</p>;
  }
  return (
    <>
      <PaymentContent data={response.data} />
    </>
  );
};

export default Payment;
