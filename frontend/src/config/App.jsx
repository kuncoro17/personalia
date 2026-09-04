import ErrorBoundary from "../pages/errorBoundaries";
import { AppRouter } from "../routes/AppRouter";

function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;
