/* eslint-disable camelcase */
import {useState, unstable_useTransition} from 'react';

import {FetchingSample} from './FetchingSample';

export function Profile() {
  const [id, setId] = useState<number | null>(null);
  const [startTransition, isPending] = unstable_useTransition();

  const handleClick = (selectedId: number | null) => {
    startTransition(() => {
      setId(selectedId);
    });
  };

  const errorRecovery = () => {
    setId(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          handleClick(1);
        }}
        style={{fontSize: '20px'}}
      >
        1
      </button>{' '}
      <button
        type="button"
        onClick={() => {
          handleClick(2);
        }}
        style={{fontSize: '20px'}}
      >
        2
      </button>{' '}
      <button
        type="button"
        onClick={() => {
          handleClick(null);
        }}
        style={{fontSize: '20px'}}
      >
        reset
      </button>
      <FetchingSample
        id={id}
        isPending={isPending}
        errorRecovery={errorRecovery}
      />
    </>
  );
}
