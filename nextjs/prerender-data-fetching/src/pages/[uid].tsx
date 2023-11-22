function UserIdPage(props: { id: string }) {
  return <h1>{props.id}</h1>;
}

export default UserIdPage;

export async function getServerSideProps(context: ContextProps) {
  const { params } = context;
  const userId = params.uid;

  // getServerSideProps do not need getStaticPaths to tell nextjs how many dynamic paths need to be pre-generated
  return {
    props: {
      id: "userid-" + userId,
    },
  };
}

interface ContextProps {
  params: {
    uid: string;
  };
}
