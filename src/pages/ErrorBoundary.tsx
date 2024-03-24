import { Component } from "react";


interface ErrorBoundaryState {
  error?: {
    error: any;
    errorInfo: any;
  };
}

export class ErrorBoundary extends Component<
  Record<string, unknown>,
  ErrorBoundaryState
> {
  constructor(props: { children: any }) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Render error caught", error, errorInfo);
    this.setState((s) => ({
      ...s,
      error: {
        error,
        errorInfo,
      },
    }));
  }

  render() {
    if (!this.state.error) return this.props.children as any;

    return (
      <>
        <h1>{this.state.error.error}</h1>
        <h1>{this.state.error.errorInfo}</h1>
      </>

    );
  }
}