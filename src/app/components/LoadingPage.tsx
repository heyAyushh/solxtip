import Loading from './Loading';

export default function LoadingPage() {
  return (
    <div className="flex grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col items-center justify-center p-4">
        <Loading />
      </div>
    </div>
  );
}
