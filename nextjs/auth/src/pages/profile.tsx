import { getSession } from "next-auth/react";
import UserProfile from "../components/profile/user-profile";
import { GetServerSideProps } from "next";

function ProfilePage() {
  return <UserProfile />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default ProfilePage;
