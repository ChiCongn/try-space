import { Component, type ErrorInfo, type ReactNode } from "react";
import { logger } from "../../utils/logger";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error(
      "react.error_boundary",
      { componentStack: info.componentStack },
      error,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="empty-panel page-empty" role="alert">
          <h2>Không thể hiển thị trang</h2>
          <p>Vui lòng tải lại hoặc quay về catalog.</p>
          <a className="primary-link" href="/catalog">
            Về catalog
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}
