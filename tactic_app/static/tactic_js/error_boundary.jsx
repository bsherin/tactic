import React from "react";

export {ErrorBoundary}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, messagae: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message , stack: error.stack};
  }

  render() {
    if (this.state.hasError) {
      if (!("fallback" in this.props) || (this.props.fallback == null)) {
        let the_message = `${this.state.message}\n${this.state.stack})`;
        return <div style={{margin: 50}}><pre>{the_message}</pre></div>
      }
      else {
        if (typeof(this.props.fallback) == "string"){
          return <pre>{this.props.fallback}</pre>;
        }
        return this.props.fallback
      }
    }

    return this.props.children;
  }
}
