import { useQuery } from '@tanstack/react-query';
import fetchOptions from '../api/fetchOptions';
import Option from '../components/option';
import { FlexColumn, Grid } from '../layout/Layout.styled';

function Home() {
  const { data: options, isLoading } = useQuery({
    queryKey: ['options'],
    queryFn: fetchOptions,
    staleTime: 10000,
    retry: false,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <FlexColumn $gap="3rem">
      <h2>Home page</h2>
      <Grid $columns={2} $gap="2.5rem">
        {options.map((option: { id: number; title: string; body: string }) => (
          <Option key={option.id} title={option.title} body={option.body} />
        ))}
      </Grid>
    </FlexColumn>
  );
}

export default Home;
