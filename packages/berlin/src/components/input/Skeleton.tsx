import ContentLoader from 'react-content-loader';

function SkeletonInput() {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={80}
      viewBox="0 0 100% 80"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="3" ry="3" width="80" height="22" />
      <rect x="0" y="30" rx="3" ry="3" width="1080" height="50" />
    </ContentLoader>
  );
}

export default SkeletonInput;
