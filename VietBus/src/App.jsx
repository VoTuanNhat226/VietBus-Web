import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "antd";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary">Hello Ant Design</Button>
    </div>
  );
}

export default App;
