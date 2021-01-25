import {Suspense} from 'react';

import {ErrorBoundary} from './ErrorBoundary';

export function DataFetchingWrapper({
  isFetchable,
  isPending,
  content,
  initialView,
  ErrorComponent,
}: {
  isFetchable: boolean;
  isPending: boolean;
  content: JSX.Element;
  initialView: JSX.Element;
  ErrorComponent: Pick<
    React.ComponentProps<typeof ErrorBoundary>,
    'Content'
  >['Content'];
}) {
  const wrap = (elem: JSX.Element) => (
    <ErrorBoundary Content={ErrorComponent}>
      <Suspense fallback={null}>{elem}</Suspense>
    </ErrorBoundary>
  );
  if (isFetchable) {
    return wrap(content);
  }
  if (isPending) return wrap(initialView);
  return null;
}
