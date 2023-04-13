// this page cannot prerender because we need user id
// also cannot name filie as [userid].tsx because we dun want ppl to anyhow put in random string and get the page rendered

function UserProfilePage(props: UserType) {
  return <h1>{props.username}</h1>;
}

export default UserProfilePage;

// this function only executes on the server after deployment
export async function getServerSideProps(context: {
  params: any;
  req: any;
  res: any;
}) {
  // can write server side code to manipulate object and get back an appripriate response
  const { params, req, res } = context;

  // return object must have a prop key, can have notFound and can have redirect key
  // cannot have redirect key
  return {
    props: {
      username: "Max",
    },
  };
}

interface UserType {
  username: string;
}
