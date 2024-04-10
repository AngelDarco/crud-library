import "./App.css";
import { AuthProvider } from "./context/Context";
import Header from "./components/body/header/Header";
import Router from "./components/routes/Router";

function App() {
  return (
    <AuthProvider>
      <div className="container">
        <Header />
        <Router />
      </div>
    </AuthProvider>
  );
}
export default App;
