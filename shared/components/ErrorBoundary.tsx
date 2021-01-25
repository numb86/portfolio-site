import {Component, ReactNode} from 'react';

type Props = {
  children: ReactNode;
  Content: ({error}: {error: Error}) => JSX.Element;
};

type State = {error: Error | null};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {error: null};
  }

  static getDerivedStateFromError(error: Error) {
    return {error};
  }

  render() {
    const {state, props} = this;
    const {Content} = props;

    if (state.error) {
      return <Content error={state.error} />;
    }

    return props.children;
  }
}
