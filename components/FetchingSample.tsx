import useSWR from 'swr';

import {fetcher} from '../shared/fetcher';
import {DataFetchingWrapper} from '../shared/components/DataFetchingWrapper';

function Content({id, isPending}: {id: number; isPending: boolean}) {
  const {data} = useSWR(`https://reqres.in/api/users/${id}?delay=1`, fetcher, {
    suspense: true,
  });

  if (id === null) {
    return <div>Initial View</div>;
  }
  return (
    <div>
      hello, {data.data.first_name}{' '}
      {isPending && (
        <span style={{fontSize: '18px', opacity: 0.8}}>isPending...</span>
      )}
    </div>
  );
}

export function FetchingSample({
  id,
  isPending,
  errorRecovery,
}: {
  id: number | null;
  isPending: boolean;
  errorRecovery: () => void;
}) {
  const isFetchable = (key: number | null): key is number => key !== null;

  const ErrorContent = ({error}: {error: Error}) => {
    const errorInfo = JSON.parse(error.message);

    return (
      <div>
        Error
        <br />
        {errorInfo.statusCode}
        <br />
        <button type="button" onClick={errorRecovery}>
          unMount
        </button>
      </div>
    );
  };

  return (
    <DataFetchingWrapper
      isFetchable={isFetchable(id)}
      isPending={isPending}
      content={
        isFetchable(id) ? <Content id={id} isPending={isPending} /> : <></>
      }
      initialView={<div>First Rendering</div>}
      ErrorComponent={ErrorContent}
    />
  );
}
