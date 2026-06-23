// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


////////////



// import React from "react";
// import AppRoutes from "./routes/AppRoutes";
// //import { DialogsProvider } from "./hooks/useDialogs/useDialogs";
// import DialogsContext from "./hooks/useDialogs/DialogsContext";
// //import { open, close } from "./hooks/useDialogs/useDialogs"; 
// import type{ OpenDialog, CloseDialog } from "./hooks/useDialogs/useDialogs"; 

// const App: React.FC = () => {
//   //return  <DialogsContext.Provider value={{ open: OpenDialog, close: CloseDialog }}><AppRoutes /></DialogsContext.Provider>;
//   return  <AppRoutes />;
// };

// export default App;

/////////////


import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import AppRoutes from "./routes/AppRoutes";
//import App from "../../layouts/AppLayout";
import AppLayout from "./layouts/AppLayout";
import { AuthProvider } from './context/AuthContext';
import { ReferenceProvider } from './context/ReferenceContext';

// ReactDOM.createRoot(document.querySelector("#root")!).render(
//   <React.StrictMode>
//     <StyledEngineProvider injectFirst>
//       <AppRoutes>
//       </AppRoutes>
//     </StyledEngineProvider>
//   </React.StrictMode>
// );

// const App: React.FC = () => {
//   return  
//   ReactDOM.createRoot(document.querySelector("#root")!).render(
//   <React.StrictMode>
//     <StyledEngineProvider injectFirst>
//       <AppRoutes>
//       </AppRoutes>
//     </StyledEngineProvider>
//   </React.StrictMode>);
// };
// export default App;

////////////


//const App: React.FC = () => {
const App: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <AuthProvider>
          <ReferenceProvider>
            <AppLayout disableCustomTheme={false} />
          </ReferenceProvider>
        </AuthProvider>
        {/* <AppLayout disableCustomTheme={false}> */}
          {/* <AppRoutes /> */}
        {/* </AppLayout>    */}
      </StyledEngineProvider>
    </React.StrictMode>
  );
};

//ReactDOM.createRoot(document.querySelector("#root")!).render(<App />);

export default App;