import AddMembership from './AddMembership';

interface Props {
  token?: string;
}

const MembershipContent = ({ token }: Props) => {
  return (
    <section>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium">Membership</h2>
          <p className=" text-slate-500 mb-3">
            As a Staff, you can manage these membership types
          </p>
        </div>
        <AddMembership token={token} />
      </div>
    </section>
  );
};

export default MembershipContent;
