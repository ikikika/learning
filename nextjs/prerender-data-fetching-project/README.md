## Project

useEffect and getStaticProps make sense
getStaticProps get inital data, useEffect update the data on client side

useEffect and getServerSideProps make no sense
getServerSideProps is reexecuted for every request anyway, guaranteed to have the latest data
